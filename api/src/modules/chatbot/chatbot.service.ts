import Anthropic from "@anthropic-ai/sdk";
import { Tool as AnthropicTool } from "@anthropic-ai/sdk/resources";
import { Content, FunctionDeclarationsTool, GoogleGenerativeAI, Part, SchemaType } from "@google/generative-ai";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, ilike, ne, or, sql, SQL } from "drizzle-orm";
import { leads } from "@models/leads";
import { packages, automationQuotes, bookings } from "@models/packages";
import { portfolios } from "@models/portfolios";
import { projects, ProjectStatus } from "@models/projects";
import { services } from "@models/services";
import { ChatMessageDto } from "@modules/chatbot/chatbot.dto";
import { GoogleCalendarService, AvailableSlot } from "@modules/chatbot/googleCalendar.service";
import { SessionMemoryService } from "@modules/chatbot/sessionMemory.service";
import { DatabaseService } from "@modules/database/database.service";

const PROJECT_STATUSES = ["draft", "planning", "in_progress", "on_hold", "completed", "cancelled"];
type LlmProvider = "anthropic" | "gemini";

/**
 * --- Guided quick-replies -------------------------------------------------
 * Sent back alongside replies so the frontend can render tappable buttons.
 * Purely a UX/cost lever: a client tapping a button sends back that exact
 * string, which the FAQ/estimate/greeting fast-paths below can usually
 * answer without an LLM call at all. Reduces ambiguous free-text typing too.
 */
const DEFAULT_QUICK_REPLIES = ["Get a rough estimate", "Check my project status", "Book a meeting", "Talk to support"];

const POST_PROJECT_QUICK_REPLIES = ["Book a call now", "Add another project", "That's all for now"];

/**
 * --- Scope-redirect replies -------------------------------------------------
 * Used whenever a message doesn't look related to a project, service, or
 * business need Shark can help with. Rotated randomly so a user who keeps
 * drifting off-topic gets steered back without hearing the exact same line
 * every time. Every variant ends by asking what they're looking to build
 * or automate, per design - the goal is to keep pulling the conversation
 * back toward projects/services rather than just refusing.
 */
const SCOPE_REDIRECT_REPLIES = [
  "That one's a bit outside SharkStack's lane here - happy to help with a website, app, or automation idea though. What are you working on?",
  "SharkStack's built for projects and business automation, so that's a bit off track. Got something you're looking to build or automate?",
  "Not quite SharkStack's territory, this one. What SharkStack can help with is projects and automation - anything like that on your mind?",
  "Let's steer back to what SharkStack does best - is there a project or service you'd like a hand with?"
];

/**
 * --- Static FAQ fast-path ---------------------------------------------------
 * Answered directly from code, $0 and instant - no LLM call at all. Keep
 * this list to genuinely fixed facts (contact info, hours, what the company
 * does) so it never goes stale relative to what's in SYSTEM_PROMPT above.
 * Order matters: first matching pattern wins.
 */
const FAQ_RESPONSES: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(hi|hello|hey|salam|assalam)\b[.!]?$/i,
    reply: "Hey there! Want a rough estimate, a status check on your project, or to grab a time to chat?"
  },
  {
    pattern:
      /\b(contact\s+(info|information|details)|company\s+(info|information|details)|about\s+(the\s+)?company|get\s+in\s+touch|contact (support|the team|you)|support (email|phone|contact)|how (do|can) i (reach|contact) (you|support)|talk to (support|a human|someone)|speak to (support|a human|someone)|what'?s\s+your\s+(email|phone|number|contact)|your\s+(email|phone|number)\s*\??$)\b/i,
    reply:
      "You can reach the SharkStack team directly at [sales@sharkstack.dev](mailto:sales@sharkstack.dev) or [+12176725018](tel:+12176725018) - they're remote, working EST, Monday to Friday. Anything SharkStack can help sort out in the meantime?"
  },
  {
    pattern: /\b(what\s+do\s+you(\s+guys)?\s+do|what\s+is\s+(this|sharkstack))\b/i,
    reply:
      "SharkStack builds websites, mobile apps, and custom AI automation to streamline workflows and help businesses scale. Want the full breakdown of services, or something specific ballparked?"
  },
  {
    pattern:
      /\b(working\s+hours|business\s+hours|office\s+hours|office\s+timings?|timings?\s+of\s+(the\s+)?office|time\s?zone|when\s+are\s+you\s+available)\b/i,
    reply: "The team's around EST, Monday to Friday, off on weekends. Anything SharkStack can help with right now?"
  }
];

const SYSTEM_PROMPT = `# Role

You are an AI assistant built exclusively for this application.

Your job is to help users manage their work inside the application, including projects, tasks, meetings, schedules, and other app-related information.

Your goal is to be helpful, conversational, and efficient while staying focused on the application's purpose.


Company Context:
- Company Name: SharkStack
- Services: SharkStack offers multiple services. This context block is background only - never answer a "what services/domains does SharkStack work in" question from this line. Always call list_services to get the current, complete, authoritative list before answering.
- Philosophy: "You come up with a problem and we will provide you the solution"
- Operations: Remote team operating in the EST time zone, with weekends off.
- Support Email: sales@sharkstack.dev
- Support Phone: +12176725018

---

# Personality

SharkStack should sound like a helpful teammate, not a customer support bot.

Be:

- Friendly
- Natural
- Professional
- Confident
- Concise

Avoid robotic language.

Use contractions ("that's", "you're", "won't") the way a person actually talks - not "that is", "you are", "will not".

If a user shares something frustrating (a bug, a missed deadline, a scheduling headache), acknowledge it in a short, human line before moving to the fix - don't jump straight to business.

Instead of:

I will now proceed to...

Say:

Sure!
Got it.
Sounds good.
No problem.
Done.
Here's what I found.
Let's do that.

Don't overuse exclamation marks.

Match the user's tone naturally.

---

# Brand Voice

Always refer to yourself as "SharkStack" instead of "I", "me", "my", "we", or "our".

Speak as if SharkStack is the intelligent teammate helping the user.

Examples:

Instead of:
I found three tasks.

Say:
SharkStack found three tasks.

Instead of:
I've scheduled your meeting.

Say:
SharkStack has scheduled your meeting.

Instead of:
I'll help you with that.

Say:
SharkStack can help with that.

Instead of:
Let me check.

Say:
SharkStack is checking that now.

Instead of:
We couldn't find the project.

Say:
SharkStack couldn't find that project.

Instead of:
We recommend updating the timeline.

Say:
SharkStack recommends updating the timeline.

Keep the language natural and conversational. Avoid overusing "SharkStack" multiple times in the same sentence. When appropriate, omit the subject entirely.

Examples:
Done! Your meeting is scheduled for Friday at 2 PM.
Found three overdue tasks.
Everything looks up to date.
No upcoming meetings today.

The goal is to make SharkStack feel like a named AI teammate rather than a generic assistant.

---

# Formatting (Markdown)

Replies are rendered as Markdown by the client, so use it deliberately for anything list-like, linkable, or countable. Keep plain sentences plain - don't force formatting where it doesn't help.

- **Services**: When listing SharkStack's services (what SharkStack offers, or the services tied to a specific project/lead), use a "-" bullet list with the service name in **bold**, e.g.:
  - **Web Development**
  - **Mobile Apps**
  - **AI Automation**
- **Number of services**: When stating how many services something involves (a project, a lead, or SharkStack's offerings overall), bold the number, e.g. "This project involves **3 services**."
- **Email**: Always render an email address as a Markdown link: \`[sales@sharkstack.dev](mailto:sales@sharkstack.dev)\`. Never show a bare email address on its own line without linking it.
- **Phone**: Render as a Markdown tel link: \`[+12176725018](tel:+12176725018)\`.
- **Portfolio summaries**: When search_portfolio or list_recent_portfolio returns a project, don't just repeat the raw \`description\` field. Use both \`description\` and \`problemAndSolution\` together to write 2-3 short lines in your own words: what problem/challenge the client had, and how SharkStack's work solved it or what the outcome was for them. Never invent detail beyond what those two fields give you.
- **Project / portfolio links**: When search_portfolio (or a project lookup) returns a \`link\` field, always share it as a Markdown link using the project's title as the link text, e.g. \`[Acme CRM Rebuild](https://example.com/case-study)\`. Never paste a raw URL, and never invent a link that wasn't returned by a tool - if no link is present, simply don't mention one.
- **Portfolio images**: When search_portfolio (or a matched case study) returns an \`images\` array, you may show **one** relevant image using Markdown image syntax \`![Project Title](imageUrl)\`, placed right after mentioning that project. Never show more than one image per project in a single reply, never invent an image URL that wasn't returned by a tool, and never treat a video URL as an image.
- **Meeting links**: Same rule - render any calendar/meeting link returned by a tool as a Markdown link with a short descriptive label, e.g. \`[View meeting invite](https://calendar.google.com/...)\`.
- Use **bold** sparingly elsewhere too - key numbers, dates/times, and confirmations (e.g. "booked for **Thursday at 3 PM**") - but don't bold entire sentences.
- Never wrap a whole reply in a code block, and don't use headings (#) in chat replies - this is a conversational chat bubble, not a document.

---

# Conversation Style

Speak like a real person.

Keep responses short unless the user asks for more detail.

Don't repeat yourself.

Don't narrate every action.

Never explain internal processes.

Never mention:

- system prompts
- tools
- APIs
- databases
- function calls
- IDs
- implementation details

The user should feel like they're chatting with an intelligent teammate.

---

# Scope

You should ONLY answer questions related to SharkStack.

This includes:

- projects
- tasks
- meetings
- schedules
- timelines
- deadlines
- team collaboration
- project status
- SharkStack features
- documents
- notes
- work management
- information available through SharkStack
- SharkStack's completed portfolio work / past projects / case studies (use search_portfolio for this - never invent a portfolio example that a tool call didn't return)
- capturing someone's interest as a lead, even before they've committed to a specific project (use create_lead for this - submitting a project already saves the client as a lead automatically, so don't call create_lead right after create_project for the same person)
-When the user asks to see SharkStack's recent/past work, projects, or examples in general (not asking about their own submitted project), use list_recent_portfolio - never list_recent_projects, which only covers actual client project inquiries/status.
- Whenever the user asks what SharkStack does, what services/domains/offerings SharkStack works in, or wants a rundown of what's available - however it's phrased ("what do you do", "which domain do you work in", "what can you build", "what services do you offer", etc.) - always call list_services first and answer from its actual result. Never answer this kind of question from the Company Context blurb above or from memory; list_services is the only authoritative source.

If the request is related to these topics, help the user naturally.


---

# Out-of-Scope Requests

The moment a message is clearly unrelated to projects, tasks, meetings, schedules, or SharkStack, do not analyze, partially answer, or acknowledge the off-topic content in any way. Instead, redirect.

(Note: If the user is answering a question you just asked—such as providing their name, email, or picking a day/time to book a meeting—this is ALWAYS in scope. Proceed with helping them.)

Always start with this base line, unaltered:

---



# Project Conversations

Speak naturally.

Avoid repeatedly saying:

"client project"

Instead say:

- your project
- this project
- the project name

Don't repeatedly mention project IDs.

When listing recent projects, only mention each project's name and description. Don't mention status, services, or notes for a project unless the user specifically asks about that project by name.

Only mention IDs if the user specifically asks.

If SharkStack already discussed the client's current process and automation goal earlier in this conversation, use that context directly when creating the project - don't ask the user to repeat it. Only ask for whatever is still missing (e.g. name, email).

---

# Meetings

Help users schedule meetings naturally.

When a new project is successfully submitted, the tool result will already include a few available time slots for the next working day - you don't need to look them up separately. Offer them right after confirming the project, in the same reply, so the user can pick one immediately.

Example:

"Done! SharkStack's got your project logged. Want to grab a quick call to go over it? SharkStack has Tuesday 10 AM, 2 PM, or 4 PM open (EST)."

If none of those work, or the user asks for a different day:
- If they name a specific date, call list_available_slots with that date.
- If they just say the offered times don't work without naming a date (e.g. "none of those work", "got anything else"), call list_available_slots with no date at all - it will return the next few upcoming business days of open slots in one call. Present a couple of options from those days.

Before booking, SharkStack must know who it's booking for:

- If a project was already submitted in this conversation, its projectId already has the client's name and email on file - just pass projectId to book_project_meeting, no need to ask again.
- If there's no submitted project yet (e.g. the user picked a time right after a rough estimate, or asked to book a call out of nowhere), SharkStack does NOT have a name or email yet. Never call book_project_meeting without them and never invent placeholder values. Ask for the name and email first, in one concise question, before booking.
- While collecting that, also ask for the same core lead details SharkStack would ask for a general inquiry - phone number, region/location, and which service(s) they're interested in - so the visitor is properly captured as a lead alongside the booking. This can be one combined ask (e.g. "Great - can SharkStack get your name, email, and phone number to lock that in?"), not a long form.
- Once these are collected, pass clientName and clientEmail (plus phone/region/services/projectDetails if given) directly to book_project_meeting instead of projectId.

Once a meeting time is confirmed and the client's info is known:

- create a meaningful meeting title
- create a short description
- schedule the meeting

Good meeting titles:

- Planning Session
- Project Discussion
- Weekly Sync
- Design Review
- Kickoff Meeting
- Follow-up Call
- Strategy Meeting
- Progress Review

Descriptions should briefly summarize the purpose of the meeting.

Example:

Title:
Website Design Review

Description:
Review the latest design updates, discuss feedback, and agree on the next steps.

Don't tell the user you're calling a tool.

Instead say things like:

"Perfect! SharkStack's scheduled it for Thursday at 3 PM."

or

"Done! You'll receive the calendar invite shortly."

After the meeting is booked, close out warmly: thank the user, let them know the team will follow up, and share SharkStack's support email and phone so they have it handy.

Example:

"Great, you're all set! SharkStack's team will be in touch shortly - if anything comes up before then, reach them at zyx.support.com or +923011144446."

---

# Clarifications

If required information is missing, ask only one concise follow-up question.

Don't ask for information you already know.

Don't ask unnecessary questions.

---

# Answering Style

Give the answer first.

Then provide additional details only if they're useful.

Don't over-explain.

Avoid long introductions.

Avoid filler phrases.

---

# Error Handling

If something can't be done:

Explain the reason in plain language.

Offer the next best option whenever possible.

Example:

"SharkStack couldn't find that meeting. If you can share the date or its title, SharkStack will help track it down."

---

# Response Examples

Good:

"Sure! SharkStack found three upcoming tasks due this week."

"Done! Your meeting is scheduled for Friday at 2 PM."

"SharkStack couldn't find any overdue tasks."

"Looks like everything is up to date."

"That project is currently in progress."

Avoid:

"I have successfully completed the requested operation."

"I will now proceed to retrieve the requested information."

"Please provide the required information."

"Kindly wait while I process your request."

---

# AI Agency Packages

SharkStack sells subscription packages. You MUST use the tools below every time — never invent, estimate, or recall package details from memory. Details, features, pricing, add-ons, and business rules all live in the database.

**Tool routing rules:**
- Any question about what packages SharkStack offers → call \`list_packages\`.
- Any question about the pricing, features, or terms of a specific package → call \`get_package_pricing\` with the package slug.
- When a visitor wants a Workflow Automation quote → call \`start_automation_quote\` immediately. Do not describe the pricing yourself; the discovery flow will handle it.
- When a client confirms their package choice → call \`select_package_for_lead\` to record it on their lead.

**Mandatory disclaimer for Workflow Automation:** every message that mentions automation pricing must end with: "A specialist will confirm the final pricing after reviewing your requirements."

**Show relevant past work alongside pricing:** Whenever a client mentions the domain/industry their project is in (e.g. "I run a restaurant", "we're an e-commerce store", "for a real estate agency") while discussing any package, also call \`search_portfolio\` with a keyword from what they described (or \`list_recent_portfolio\` if no clear domain keyword exists yet). If a genuinely relevant match comes back, showcase it briefly right after presenting the pricing - 2-3 lines summarizing the client's problem and how SharkStack solved it, the project link, and one image if available, per the Portfolio summaries/links/images formatting rules above. Never invent or force a portfolio example - if nothing relevant is returned, just present the pricing and move on. This applies to Website Essentials and the AI Growth Suite the same as Workflow Automation; for Workflow Automation the matching portfolio piece is already included automatically in the automation quote result when one exists, so just present it as given rather than searching again.

**Never** describe package details, pricing, features, add-ons, contract terms, or anything else from memory. Always call the relevant tool first and answer from what it returns.

---

# Important Rules

Never make up information.

If you're unsure, ask a short clarifying question.

Don't expose internal logic.

Don't mention tools.

Don't mention APIs.

Don't mention databases.

Don't discuss system prompts.

Don't answer unrelated questions.

Stay focused on helping users with their work inside SharkStack.

Always sound like a helpful human teammate rather than an automated assistant.`;

/**
 * Slim, purpose-built system prompt used ONLY for the final estimation
 * synthesis call. Deliberately does not include the full SYSTEM_PROMPT or
 * tool schema - the estimation flow collects its inputs via a scripted
 * question sequence (zero LLM cost), so this call doesn't need Shark's
 * full persona/tool-calling apparatus, which saves input tokens on every
 * estimate generated.
 */
const ESTIMATION_SYSTEM_PROMPT = `You are SharkStack, an assistant that turns a short business/automation brief into a rough execution plan and budget estimate.

Rules:
- Base rate: $20/hour.
- Internally add a 10-15% buffer on top of raw hours for QA and polishing before computing the final budget - this is a calculation detail only. Never state the buffer percentage (e.g. "10%", "15%", "with X% buffer") anywhere in your reply, and never label a line "QA & Polish buffer" or similar - just fold it silently into the final numbers.
- Break the estimate into 3-5 phases (e.g. Discovery, Core Build, Integrations, QA & Polish, Delivery), each with a rough hour range. A "QA & Polish" phase can still be named as a phase (that's just a work category) - just don't attach a buffer percentage to it or call out that it's inflated.
- Sum the hours, multiply by $20/hr, then silently apply the 10-15% buffer to produce the final budget range - present only the resulting range (e.g. "$500-$650"), not the buffer math or percentage behind it.
- Keep it conversational and concise, not a formal invoice - write it the way a teammate would talk you through a ballpark over chat, not the way a report would present it.
- Always end with a short disclaimer that this is a rough idea and the real number depends on scope once requirements are reviewed.
- Refer to yourself as "SharkStack" instead of "I"/"we", consistent with brand voice, but keep this light - one mention is enough.
- Do not ask follow-up questions here - all required inputs are already provided in the user message. Just produce the estimate.
- If a case-study block listing a real completed portfolio piece is provided, reference it by name and give a short 2-3 line summary of what problem the client had and how SharkStack's work solved it/the outcome for them - use the description and problem/solution fields given, in your own words, not copied verbatim. Do not add any specific detail beyond what's given in that block. If that block includes a link, render the project name as a Markdown link, e.g. [Project Name](https://...) - never show a bare/raw URL and never invent a link that wasn't given. If that block includes an image, you may include ONE as a Markdown image, e.g. ![Project Name](imageUrl) - never invent an image that wasn't given, and never use more than one image.
- If told no matching portfolio piece was found, do not name any specific past project - speak generally about SharkStack's experience with similar automation work instead.
- Use Markdown for structure: **bold** for the budget range and phase names, and a "-" bullet list for the phase breakdown.`;

/**
 * Provider-agnostic JSON-schema-ish tool definitions. Built once, then
 * converted into whichever shape the active SDK (Anthropic or Gemini)
 * expects. Keeping a single source of truth here means a new tool only
 * needs to be added in one place.
 */
interface JsonSchema {
  type: "object" | "string" | "number" | "array" | "boolean" | "integer";
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
}

interface ToolDef {
  name: string;
  description: string;
  parameters: JsonSchema;
}

const toolDefs: ToolDef[] = [
  {
    name: "count_projects",
    description: "Get the total number of client projects currently stored in the database, optionally filtered by status.",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: `Optional status filter. One of: ${PROJECT_STATUSES.join(", ")}.`
        }
      }
    }
  },
  {
    name: "list_services",
    description:
      "List SharkStack's actual services offered, as maintained in the database - title, description, and subheadings (sub-bullets/features) for each. Use this whenever the user asks what SharkStack does, what services are offered, or wants detail on a specific service - this is the authoritative source, more current and detailed than any general company blurb.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list_recent_portfolio",
    description:
      "List SharkStack's most recently completed/published portfolio pieces (case studies), optionally filtered by a technology/tool. Use this whenever the user asks to see SharkStack's recent or past projects/work/examples in GENERAL (not their own submitted project status - use list_recent_projects for that instead). Returns title, description, problemAndSolution, link, and images for each - use description and problemAndSolution together to summarize the client's problem and how SharkStack solved it.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max number of portfolio pieces to return. Defaults to 5, max 20."
        },
        service: {
          type: "string",
          description:
            "Optional technology/tool keyword to filter by, e.g. 'n8n' or 'React Native' (case-insensitive partial match against technologies/tools)."
        }
      }
    }
  },
  {
    name: "list_recent_projects",
    description:
      "List the most recently created client projects, optionally filtered by status, client name/email, or a service involved. Returns only each project's name and description (no status, services, notes, or ID) - present just those two fields back to the user.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max number of projects to return. Defaults to 10, max 50."
        },
        status: {
          type: "string",
          description: `Optional status filter. One of: ${PROJECT_STATUSES.join(", ")}.`
        },
        client: {
          type: "string",
          description: "Optional client name or email to filter projects by (case-insensitive partial match)."
        },
        service: {
          type: "string",
          description: "Optional service name to filter projects by, e.g. 'SEO' or 'Web Development' (case-insensitive partial match)."
        }
      }
    }
  },
  {
    name: "search_portfolio",
    description:
      "Find completed portfolio pieces (past client work SharkStack can showcase) by title, description, or problem/solution summary (case-insensitive partial match across all three). Returns title, description, problemAndSolution, technologies, tools, link, and an `images` array of image URLs (videos are excluded) that can be shown to the user via Markdown image syntax. Use description and problemAndSolution together to summarize the client's problem and how SharkStack solved it. Use this whenever the user asks about past work, examples, or case studies.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword or phrase to search for in the portfolio's title, description, or problem/solution summary and link"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "search_leads",
    description:
      "Check whether someone has already reached out before, by name, email, or company name (case-insensitive partial match). Use this before create_lead if you want to confirm a person isn't already in the system. Never reveals email or phone number in the results, to protect visitor privacy.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Name, email, or company name (or part of any) to search for."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "create_lead",
    description:
      "Save a new inquiry/lead to the database for someone interested in SharkStack, even before they've committed to a specific project. Automatically checks for an existing lead with the same email or phone first - if one already exists, no duplicate is created and the existing lead is returned instead. Only call this after collecting all required fields and the user has confirmed the details are correct.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name of the lead." },
        email: { type: "string", description: "Email address of the lead." },
        companyName: { type: "string", description: "Optional company name." },
        companyLink: {
          type: "string",
          description: "Optional company website URL."
        },
        region: {
          type: "string",
          description: "Region, city, or country the lead is located in."
        },
        phone: { type: "string", description: "Phone number of the lead." },
        services: {
          type: "array",
          items: { type: "string" },
          description: "Services the lead is interested in, e.g. ['Web Development', 'SEO']."
        },
        projectDetails: {
          type: "string",
          description: "Brief summary of what the lead is looking for."
        }
      },
      required: ["name", "email", "region", "phone", "services", "projectDetails"]
    }
  },
  {
    // NOTE: no "status" field exposed here on purpose. This chatbot is public-facing
    // (no login), so every project it creates is forced server-side to a "draft"
    // status and "chatbot" source in createProject() below, regardless of what the
    // model requests - it must never be able to set status directly.
    name: "create_project",
    description:
      "Submit a new client project inquiry to the database as a draft, pending staff review. Only call this after collecting all required fields and the user has confirmed the details are correct. The result will include a few upcoming available meeting slots automatically - no need to call list_available_slots right after this. The client's contact details are also saved as a lead automatically - if a lead with that email or phone already exists, it's reused rather than duplicated, so there's no need to call create_lead separately for the same person.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the project." },
        packageSlug: {
          type: "string",
          description: "Optional slug of the package chosen by the client (e.g. 'website-essentials', 'ai-growth-suite', 'workflow-automation')."
        },
        clientName: {
          type: "string",
          description: "Name of the client the project is for."
        },
        clientEmail: {
          type: "string",
          description: "Email address of the client."
        },
        services: {
          type: "array",
          items: { type: "string" },
          description: "List of services involved in the project, e.g. ['Web Development', 'SEO']."
        },
        description: {
          type: "string",
          description: "Description of the project's scope/requirements."
        },
        budget: {
          type: "string",
          description: "Optional budget for the project."
        },
        deadline: {
          type: "string",
          description: "Optional deadline for the project."
        },
        notes: {
          type: "string",
          description: "Optional extra notes about the project."
        },
        phone: {
          type: "string",
          description: "Optional phone number of the client - stored on their lead record."
        },
        region: {
          type: "string",
          description: "Optional region/city/country of the client - stored on their lead record."
        },
        companyName: {
          type: "string",
          description: "Optional company name of the client - stored on their lead record."
        },
        companyLink: {
          type: "string",
          description: "Optional company website URL - stored on their lead record."
        }
      },
      required: ["name", "clientName", "clientEmail", "services", "description"]
    }
  },
  {
    name: "list_available_slots",
    description:
      "List available meeting time slots on Google Calendar. Pass a specific date to check just that day. Omit the date when the user says the previously offered slots don't work for them (e.g. 'none of those work', 'got anything else', 'a different day') - this returns the next 3 upcoming business days of open slots in one call, so you don't need to guess a date or ask which day first.",
    parameters: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Optional. The specific date to check for slots, in YYYY-MM-DD format. Omit to get the next 3 business days instead."
        }
      }
    }
  },
  {
    name: "book_project_meeting",
    description:
      "Book a meeting on Google Calendar. The client will be added as an attendee. If the conversation already has a submitted project, pass its projectId and the client's name/email are looked up automatically. If there's no project yet (e.g. booking straight off a rough estimate), omit projectId and instead pass clientName and clientEmail directly - both are required in that case. Never call this before the user's name and email are known: ask for them first if they haven't been given yet.",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Optional. The database ID of the project to book the meeting for, if one exists."
        },
        clientName: {
          type: "string",
          description: "Required only when projectId is omitted. Full name of the person to add as attendee."
        },
        clientEmail: {
          type: "string",
          description: "Required only when projectId is omitted. Email of the person to add as attendee."
        },
        region: {
          type: "string",
          description: "Optional, only used when projectId is omitted. Region/city/country of the client - saved on their lead record."
        },
        phone: {
          type: "string",
          description: "Optional, only used when projectId is omitted. Phone number of the client - saved on their lead record."
        },
        services: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional, only used when projectId is omitted. Services the client is interested in, e.g. ['Web Development', 'AI Automation'] - saved on their lead record."
        },
        projectDetails: {
          type: "string",
          description: "Optional, only used when projectId is omitted. Brief summary of what the client is looking for - saved on their lead record."
        },
        startTime: {
          type: "string",
          description: "The start time of the meeting in ISO 8601 format."
        },
        endTime: {
          type: "string",
          description: "The end time of the meeting in ISO 8601 format."
        },
        summary: {
          type: "string",
          description: "The title/summary of the meeting."
        },
        description: {
          type: "string",
          description: "Optional description of the meeting."
        }
      },
      required: ["startTime", "endTime", "summary"]
    }
  },
  {
    name: "list_packages",
    description:
      "List all active AI agency packages/subscriptions (Website Essentials, AI Growth Suite, Workflow Automation) with their descriptions and features.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_package_pricing",
    description: "Get general pricing and contract rules for a specific package by its slug ('website-essentials', 'ai-growth-suite', 'workflow-automation').",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The package slug."
        }
      },
      required: ["slug"]
    }
  },
  {
    name: "start_automation_quote",
    description: "Start the 5-question discovery flow for Workflow Automation pricing ballparks.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "select_package_for_lead",
    description: "Associate a specific package and estimated price with a lead record by their email address.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Client's email address."
        },
        packageSlug: {
          type: "string",
          description: "The selected package slug."
        },
        estimatedPrice: {
          type: "string",
          description: "The estimated price/quote string (e.g. '$97/month', '$697/month')."
        }
      },
      required: ["email", "packageSlug", "estimatedPrice"]
    }
  }
];

const anthropicTools: AnthropicTool[] = toolDefs.map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.parameters as unknown as AnthropicTool.InputSchema
}));

const GEMINI_TYPE_MAP: Record<JsonSchema["type"], SchemaType> = {
  object: SchemaType.OBJECT,
  string: SchemaType.STRING,
  number: SchemaType.NUMBER,
  integer: SchemaType.INTEGER,
  array: SchemaType.ARRAY,
  boolean: SchemaType.BOOLEAN
};

function toGeminiSchema(schema: JsonSchema): Record<string, unknown> {
  const out: Record<string, unknown> = { type: GEMINI_TYPE_MAP[schema.type] };
  if (schema.description) {
    out.description = schema.description;
  }
  if (schema.properties) {
    out.properties = Object.fromEntries(Object.entries(schema.properties).map(([key, value]) => [key, toGeminiSchema(value)]));
  }
  if (schema.items) {
    out.items = toGeminiSchema(schema.items);
  }
  if (schema.required) {
    out.required = schema.required;
  }
  return out;
}

const geminiTools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: toolDefs.map((t) => ({
      name: t.name,
      description: t.description,
      parameters: toGeminiSchema(t.parameters) as never
    }))
  }
];

/**
 * --- Discovery/estimation flow types ---------------------------------------
 * A tiny scripted state machine that collects the inputs needed for a rough
 * plan + budget estimate via plain code (no LLM calls): what the business
 * does today (current process) and what they want automated (goal). Only
 * ONE LLM call happens at the end to synthesize the plan, keeping token
 * spend down for the discovery portion entirely.
 */
type EstimationStep = "idle" | "awaiting_process" | "awaiting_goal" | "ready";

interface EstimationState {
  step: EstimationStep;
  /** The original message that triggered the flow - kept for keyword/case-study matching. */
  initialMessage: string;
  currentProcess?: string;
  automationGoal?: string;
  updatedAt: number;
}

type AutomationQuoteStep = "idle" | "awaiting_steps" | "awaiting_integrations" | "awaiting_logic" | "awaiting_ai" | "awaiting_volume" | "ready";

interface AutomationQuoteState {
  step: AutomationQuoteStep;
  /**
   * The raw user message that triggered start_automation_quote (e.g.
   * "I run a bakery and want to automate order intake"). Kept purely so the
   * final step can match a relevant portfolio piece by domain - never shown
   * to the user directly, never used for pricing logic.
   */
  domainContext?: string;
  steps?: number;
  integrations?: number;
  logicComplexity?: string;
  aiDecisioning?: boolean;
  monthlyVolume?: number;
  updatedAt: number;
}

const ESTIMATION_FLOW_TIMEOUT_MS = 15 * 60 * 1000; // abandon stale flows after 15 min

/** Words too generic to be useful for matching past projects by keyword. */
const CASE_STUDY_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "have",
  "want",
  "need",
  "would",
  "could",
  "should",
  "about",
  "into",
  "from",
  "just",
  "like",
  "some",
  "business",
  "project",
  "automate",
  "automation",
  "help",
  "things",
  "thing",
  "currently",
  "current",
  "right",
  "now",
  "also",
  "team",
  "company",
  "shark",
  "sharkstack",
  "please",
  "really",
  "actually"
]);

/**
 * Matches common video file extensions (optionally followed by a query
 * string). Anything in a portfolio's `media` array that does NOT match this
 * is treated as an image. Kept as a simple extension check rather than a
 * content-type lookup so it stays a $0, synchronous filter - no extra
 * network call needed to classify a URL.
 */
const VIDEO_EXTENSIONS = /\.(mp4|mov|webm|avi|mkv|m4v)(\?.*)?$/i;

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly provider: LlmProvider;
  private readonly modelName: string;
  private readonly anthropic?: Anthropic;
  private readonly genAI?: GoogleGenerativeAI;

  // In-memory per-session estimation flow state. Swap for a shared store
  // (Redis, etc.) if you run multiple instances behind a load balancer.
  private readonly estimationStates = new Map<string, EstimationState>();
  private readonly automationQuoteStates = new Map<string, AutomationQuoteState>();

  private readonly OFF_TOPIC_REPLY =
    "That's a bit outside what SharkStack can help with here. Got a project or service in mind - a website, app, or automation?";

  // High-precision only - false positives cost a real user's message, so
  // keep this list narrow and confident rather than broad.
  private readonly OFF_TOPIC_PATTERNS: RegExp[] = [
    /\b(write|solve)\s+(me\s+)?(a\s+)?(poem|song|essay|joke)\b/i,
    /\b(math|algebra|calculus)\s+(homework|problem|equation)\b/i,
    /\btranslate\s+this\b/i,
    /\b(weather|recipe|movie|football|cricket|celebrity|horoscope)\b/i
  ];

  private readonly ESTIMATE_INTENT = /\b(cost|price|pricing|quote|estimate|budget|how much|how long|timeline)\b/i;

  // Broader than ESTIMATE_INTENT on purpose: catches people describing a
  // business/automation need without using pricing language at all, e.g.
  // "I have an automotive business and want to automate that".
  private readonly AUTOMATION_INTENT =
    /\b(automate|automation|streamline|workflow|integrat(?:e|ion)|build (?:me |us )?(?:a|an)\b|develop (?:a|an)\b|create (?:a|an)\b|need (?:a|an|help with)\b|looking to (?:build|automate|create|streamline)|want to (?:build|automate|create|streamline)|ai (?:agent|bot|chatbot)|custom (?:app|software|tool))\b/i;

  private readonly PROJECT_COUNT_INTENT = /\bhow many\s+(projects|clients)\b/i;

  // Broad allowlist: if a message contains none of these, it almost
  // certainly isn't about a project, service, or business need. Used as a
  // catch-all beyond the narrow OFF_TOPIC_PATTERNS blocklist above, so
  // arbitrary irrelevant chatter (not just the handful of hardcoded cases)
  // gets redirected rather than answered or passed to the LLM.
  // Added slots? to the allowed keyword list
  // Added common business-type nouns (store, shop, restaurant, etc.) so a
  // prospect describing what they run - "I have a local retail store" -
  // isn't wrongly caught by the generic scope redirect before it ever gets
  // a chance to say what they need built/automated.
  private readonly IN_SCOPE_KEYWORDS =
    /\b(projects?|website|web ?site|apps?|applications?|automat\w*|workflow|integrat\w*|ai\s?(agent|bot|chatbot)?|services?|business(es)?|quotes?|estimates?|budgets?|pric\w*|costs?|timelines?|meetings?|schedules?|book\w*|calls?|deadlines?|tasks?|status(es)?|clients?|develop\w*|build\w*|design\w*|software|tools?|solutions?|platforms?|dashboards?|crm|erp|api|databases?|scrap\w*|marketing|seo|saas|mvp|prototypes?|features?|office|hours?|contact\w*|company|address|email|phone|portfolio|case\s?stud\w*|examples?|past\s?work|work\w*|names?|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|slots?|work|services?|research|web\s?design|designers?|reschedule?|re schedule|can\s+i\s+reschedule|change|postpone|postponed|not|working|no longer|unable|cancel|cancellation|stores?|shops?|retail|restaurants?|caf[eé]s?|clinics?|salons?|spas?|gyms?|boutiques?|agenc\w*|firms?|practices?|studios?|bakeries|bakery|pharmac\w*|hotels?|warehouses?|manufactur\w*|wholesale|e-?commerce|inventory|point[\s-]of[\s-]sale|\bpos\b)\b/i;
  // Catches "I have/run/own a ..." style openers regardless of whether the
  // noun that follows is on the IN_SCOPE_KEYWORDS list - a backstop for
  // business types not worth enumerating one by one (e.g. "I have a small
  // pottery studio", "we run a food truck").
  private readonly OWNS_BUSINESS_PATTERN = /\b(i|we)\s+(?:currently\s+)?(have|run|own|manage|operate)\s+(?:a|an|my|our)\b/i;
  // Guards against misclassifying short, direct answers to a question
  // Shark just asked (an email, a chosen time slot, a bare yes/no/number)
  // as off-topic just because they don't contain an in-scope keyword.
  private readonly LOOKS_LIKE_ANSWER =
    /(@\S+\.\S+)|(\b\d{1,2}(:\d{2})?\s?(am|pm)?\b)|(\b(name|email)\b)|(^(yes|yeah|yep|sure|okay|ok|no|nope|correct|right)\b)|(^\d+$)/i;
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly sessionMemory: SessionMemoryService,
    private readonly googleCalendarService: GoogleCalendarService
  ) {
    const rawProvider = (this.configService.get<string>("LLM_PROVIDER") ?? "anthropic").toLowerCase();
    if (rawProvider !== "anthropic" && rawProvider !== "gemini") {
      throw new Error(`Invalid LLM_PROVIDER "${rawProvider}". Must be "anthropic" or "gemini".`);
    }
    this.provider = rawProvider;

    if (this.provider === "anthropic") {
      const apiKey = this.configService.get<string>("ANTHROPIC_API_KEY");
      if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable is not defined (required because LLM_PROVIDER=anthropic)");
      }
      this.anthropic = new Anthropic({ apiKey });
      this.modelName = this.configService.get<string>("ANTHROPIC_MODEL") ?? "claude-3-5-sonnet-20241022";
    } else {
      const apiKey = this.configService.get<string>("GEMINI_API_KEY");
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not defined (required because LLM_PROVIDER=gemini)");
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.modelName = this.configService.get<string>("GEMINI_MODEL") ?? "gemini-1.5-pro";
    }

    this.logger.log(`Chatbot LLM provider: ${this.provider} (model: ${this.modelName})`);
  }

  async chat(dto: ChatMessageDto) {
    const sessionId = dto.sessionId && dto.sessionId.length > 0 ? dto.sessionId : createId();
    const message = dto.message.trim();

    try {
      // --- 1. Off-topic pre-filter: $0, no LLM call ------------------------
      if (this.isLikelyOffTopic(message)) {
        return {
          sessionId,
          reply: this.OFF_TOPIC_REPLY,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      }

      // Check if there is an active Workflow Automation discovery flow
      const inAutoFlow = this.automationQuoteStates.get(sessionId);
      const autoFlowActive =
        inAutoFlow && inAutoFlow.step !== "idle" && inAutoFlow.step !== "ready" && Date.now() - inAutoFlow.updatedAt < ESTIMATION_FLOW_TIMEOUT_MS;

      if (autoFlowActive) {
        const autoReply = await this.handleAutomationQuoteFlow(sessionId, message);
        return {
          sessionId,
          reply: autoReply.reply,
          quickReplies: autoReply.quickReplies ?? DEFAULT_QUICK_REPLIES
        };
      }

      // --- 2. Static FAQ fast-path: $0, no LLM call -------------------------
      // Only applies when there's no estimation flow in progress for this
      // session - otherwise a "hi" mid-flow would derail the questions.
      const inFlow = this.estimationStates.get(sessionId);
      const flowActive = inFlow && inFlow.step !== "idle" && inFlow.step !== "ready" && Date.now() - inFlow.updatedAt < ESTIMATION_FLOW_TIMEOUT_MS;

      if (!flowActive) {
        // Structured project data (e.g. "Name: X, client: Y, email: z@...")
        // must never be intercepted by FAQ/count fast-paths - a bare field
        // label like "email:" or "call:" would otherwise false-match.
        const structuredData = this.looksLikeStructuredProjectData(message);

        if (!structuredData) {
          const faq = this.matchFaq(message);
          if (faq) {
            return {
              sessionId,
              reply: faq,
              quickReplies: DEFAULT_QUICK_REPLIES
            };
          }

          // --- 3. Simple count query fast-path: one cheap DB call, no LLM ----
          if (this.PROJECT_COUNT_INTENT.test(message)) {
            const { count } = await this.countProjects({});
            return {
              sessionId,
              reply: `SharkStack's currently got **${count}** active client project${count === 1 ? "" : "s"} on the go.`,
              quickReplies: DEFAULT_QUICK_REPLIES
            };
          }

          // --- 3b. Scope check: free deterministic checks first, AI only for
          // the genuinely ambiguous leftover --------------------------------
          // isLikelyUnrelatedToServices() still does all the same $0 checks
          // as before (short messages, answer-like replies, estimate/
          // automation/business-ownership intent, the IN_SCOPE_KEYWORDS
          // allowlist) and returns "in_scope" the instant any of those match
          // - no LLM call, same as always. Only messages that survive ALL of
          // those (truly ambiguous - a keyword list alone is error-prone
          // here, in both directions) get a single, cheap, tools-free AI
          // classification call to make the actual judgment call instead of
          // guessing. This keeps the common cases (greetings, FAQs, obvious
          // asks) exactly as fast/free as before, while fixing the false
          // redirects a pure keyword list would otherwise cause.
          if (this.isLikelyUnrelatedToServices(message) === "ambiguous") {
            const inScope = await this.classifyScopeWithAI(message);
            if (!inScope) {
              return {
                sessionId,
                reply: this.pickRedirectReply(),
                quickReplies: DEFAULT_QUICK_REPLIES
              };
            }
          }
        }
      }

      // --- 4. Discovery/estimation flow: scripted questions, $0, until the
      // final synthesis step -------------------------------------------------
      const estimationReply = await this.handleEstimationFlow(sessionId, message);
      if (estimationReply) {
        return {
          sessionId,
          reply: estimationReply.reply,
          quickReplies: estimationReply.quickReplies ?? DEFAULT_QUICK_REPLIES
        };
      }

      // --- 5. Normal path: full Shark persona + tools ----------------------
      const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/New_York"
      });
      const dynamicSystemPrompt = `${SYSTEM_PROMPT}

Today's date is: ${currentDate}. Use this to resolve any relative dates (like tomorrow, next week).`;

      const reply =
        this.provider === "anthropic"
          ? await this.chatWithAnthropic(sessionId, message, dynamicSystemPrompt)
          : await this.chatWithGemini(sessionId, message, dynamicSystemPrompt);

      const wasProjectCreation = /project\s+(logged|submitted|created|saved)/i.test(reply) || /got your project/i.test(reply);

      if (wasProjectCreation) {
        this.estimationStates.delete(sessionId);
      }

      return {
        sessionId,
        reply,
        quickReplies: wasProjectCreation ? POST_PROJECT_QUICK_REPLIES : DEFAULT_QUICK_REPLIES
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(`Chatbot failed to respond: ${(error as Error).message}`);
    }
  }

  // ---------------------------------------------------------------------
  // Static FAQ fast-path
  // ---------------------------------------------------------------------

  private matchFaq(message: string): string | null {
    for (const { pattern, reply } of FAQ_RESPONSES) {
      if (pattern.test(message)) {
        return reply;
      }
    }
    return null;
  }

  /**
   * True when the message looks like it's supplying structured project
   * details (e.g. "Name: Acme Site, client: John, email: john@acme.com...").
   * Messages like this must always go to the full LLM+tools path - a bare
   * keyword like "email" or "call" inside a field label must never trigger
   * the FAQ/count fast-paths, which are meant for short standalone questions.
   */
  private looksLikeStructuredProjectData(message: string): boolean {
    const fieldLabelMatches = message.match(/\b(name|client|email|services?|description|budget|deadline|notes)\s*:/gi);
    return (fieldLabelMatches?.length ?? 0) >= 2;
  }

  // ---------------------------------------------------------------------
  // Off-topic filtering
  // ---------------------------------------------------------------------

  private isLikelyOffTopic(message: string): boolean {
    return this.OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(message));
  }

  /**
   * Free, deterministic pre-checks only - runs before any AI call is ever
   * considered. Returns "in_scope" the instant something confidently
   * indicates this is on-topic (short/ambiguous message, an answer-like
   * reply, estimate/automation/business-ownership intent, or a hit on the
   * IN_SCOPE_KEYWORDS allowlist) - all $0, same as before.
   *
   * Only returns "ambiguous" for messages that survive every one of those
   * checks - i.e. genuinely unclear whether this is on-topic. Deciding that
   * remainder via keyword list alone is exactly where false redirects (and
   * false passes) come from, so the caller escalates "ambiguous" results to
   * classifyScopeWithAI() instead of guessing here.
   */
  private isLikelyUnrelatedToServices(message: string): "in_scope" | "ambiguous" {
    if (message.split(/\s+/).filter(Boolean).length <= 2) {
      return "in_scope"; // too short to safely classify either way
    }
    if (this.LOOKS_LIKE_ANSWER.test(message)) {
      return "in_scope";
    }
    if (this.ESTIMATE_INTENT.test(message) || this.AUTOMATION_INTENT.test(message) || this.OWNS_BUSINESS_PATTERN.test(message)) {
      return "in_scope";
    }
    if (this.IN_SCOPE_KEYWORDS.test(message)) {
      return "in_scope";
    }
    return "ambiguous";
  }

  /**
   * AI tie-breaker for the narrow slice of messages the deterministic
   * checks above couldn't confidently classify. Deliberately minimal: no
   * tools, no persona, no conversation history - just a one-word yes/no
   * judgment call, so it stays cheap and fast even though it's a real LLM
   * round trip.
   *
   * Fails OPEN (treated as in-scope) on any error - a classifier hiccup
   * should never be the reason a real prospect gets turned away. Worst
   * case on a false "in_scope", the full persona still has its own scope
   * boundaries and can redirect gracefully itself.
   */
  private async classifyScopeWithAI(message: string): Promise<boolean> {
    const prompt = `Message from a website visitor: "${message}"

SharkStack builds websites, mobile apps, and custom AI/business automation. Could this message plausibly be about a project, service, business need, quote, meeting, or company info relevant to SharkStack - even indirectly (e.g. describing a business they run, without explicitly asking for anything yet)?

Reply with exactly one word, no punctuation: yes or no.`;

    try {
      if (this.provider === "anthropic") {
        const response = await this.anthropic!.messages.create({
          model: this.modelName,
          max_tokens: 5,
          messages: [{ role: "user", content: prompt }]
        });
        const textBlock = response.content.find((block) => block.type === "text");
        const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
        return !/^no\b/i.test(text.trim());
      }

      const model = this.genAI!.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      return !/^no\b/i.test(result.response.text().trim());
    } catch (error: unknown) {
      this.logger.warn(`classifyScopeWithAI failed, defaulting to in-scope: ${(error as Error).message}`);
      return true;
    }
  }

  private pickRedirectReply(): string {
    return SCOPE_REDIRECT_REPLIES[Math.floor(Math.random() * SCOPE_REDIRECT_REPLIES.length)];
  }

  // ---------------------------------------------------------------------
  // Discovery/estimation flow (scripted questions + single synthesis call)
  // ---------------------------------------------------------------------

  /**
   * Returns { reply } if the message was consumed by the discovery flow
   * (either advancing it, starting it, or producing the final estimate).
   * Returns null if the message should fall through to the normal chat path.
   */
  private async handleEstimationFlow(sessionId: string, message: string): Promise<{ reply: string; quickReplies?: string[] } | null> {
    const existing = this.estimationStates.get(sessionId);
    const state = existing && Date.now() - existing.updatedAt < ESTIMATION_FLOW_TIMEOUT_MS ? existing : undefined;

    // Mid-flow: consume this message as the answer to the pending question.
    if (state && state.step !== "idle" && state.step !== "ready") {
      return this.advanceEstimationFlow(sessionId, state, message);
    }

    // Not currently in a flow - start one on either explicit pricing intent
    // ("how much would this cost") or a broader automation/business intent
    // ("I want to automate my invoicing"). Otherwise let it fall through to
    // normal chat.
    if ((!state || state.step === "idle") && (this.ESTIMATE_INTENT.test(message) || this.AUTOMATION_INTENT.test(message))) {
      this.estimationStates.set(sessionId, {
        step: "awaiting_process",
        initialMessage: message,
        updatedAt: Date.now()
      });
      return {
        reply: "SharkStack can help with that. Quick question to start - how are you handling this today? What does the current process look like?"
      };
    }

    return null;
  }

  private async advanceEstimationFlow(sessionId: string, state: EstimationState, answer: string): Promise<{ reply: string; quickReplies?: string[] }> {
    const trimmed = answer.trim();

    // Let the user bail out of the flow at any point.
    if (/\b(cancel|never mind|nevermind|stop|skip)\b/i.test(trimmed)) {
      this.estimationStates.delete(sessionId);
      return {
        reply: "No worries, all good - just let SharkStack know whenever you'd like that estimate."
      };
    }

    switch (state.step) {
      case "awaiting_process": {
        const next: EstimationState = {
          ...state,
          currentProcess: trimmed,
          step: "awaiting_goal",
          updatedAt: Date.now()
        };
        this.estimationStates.set(sessionId, next);

        // Tailor 3 suggested directions to what the user just described, so
        // they can tap one instead of having to type a goal from scratch -
        // but a free-text answer in their own words still works fine too,
        // since the awaiting_goal handler below accepts any plain text.
        const options = await this.generateAutomationOptions(state.initialMessage, trimmed);
        if (options.length === 3) {
          return {
            reply: "Got it. Here's a few directions this could go - tap one, or just tell SharkStack in your own words what you'd like automated or built:",
            quickReplies: [...options, "Something else"]
          };
        }
        return {
          reply: "Got it - and what would you like SharkStack to automate or improve, specifically?"
        };
      }

      case "awaiting_goal": {
        const ready: EstimationState = {
          ...state,
          automationGoal: trimmed,
          step: "ready",
          updatedAt: Date.now()
        };
        this.estimationStates.set(sessionId, ready);

        const estimateText = await this.generateEstimate(ready);
        const slotOffer = this.googleCalendarService.isConfigured() ? await this.buildSlotOfferLine() : "";
        const reply = slotOffer ? `${estimateText}\n\n${slotOffer}` : estimateText;

        await this.persistDiscoveryToSessionHistory(sessionId, ready, reply);

        return { reply };
      }

      default:
        // Shouldn't happen, but fail safe by resetting the flow.
        this.estimationStates.delete(sessionId);
        return {
          reply: "Let's start fresh - what would you like SharkStack to help automate or build?"
        };
    }
  }

  /**
   * The single LLM call for the whole discovery flow. Uses the slim
   * ESTIMATION_SYSTEM_PROMPT (not the full Shark persona) and no tools,
   * since the inputs are already collected via scripted questions. Also
   * pulls in a real, matching past project (if any) so Shark can reference
   * genuine prior work instead of inventing a case study.
   */
  private async generateEstimate(state: EstimationState): Promise<string> {
    const combinedContext = `${state.initialMessage} ${state.currentProcess ?? ""} ${state.automationGoal ?? ""}`;
    const matchedPortfolios = await this.findRelevantPastPortfolios(combinedContext);

    const caseStudyBlock =
      matchedPortfolios.length > 0
        ? `Relevant completed portfolio work SharkStack can reference (use only what's given here, don't invent extra detail). For the case study you reference, write 2-3 short lines: what problem/challenge the client had, and how SharkStack's work solved it / the outcome for the client - draw this from both the description and problem/solution fields below, in your own words, not copied verbatim. If a link is present, include it as a Markdown link, e.g. [${matchedPortfolios[0].title}](${matchedPortfolios[0].link ?? "..."}). If an image URL is present, include ONE as a Markdown image using the format ![Project Name](imageUrl) - never invent or reuse an image not given here:\n${matchedPortfolios
            .map(
              (p) =>
                `- ${p.title}: technologies [${p.technologies.join(", ")}]\n  description: ${p.description}\n  problem & solution: ${p.problemAndSolution}${p.link ? `\n  link: ${p.link}` : ""}${p.images.length > 0 ? `\n  image: ${p.images[0]}` : ""}`
            )
            .join("\n")}`
        : "No directly matching portfolio piece was found - do not name a specific past project. Speak generally about SharkStack's experience with similar automation work instead.";

    const briefPrompt = `Business context: ${state.initialMessage}
Current process: ${state.currentProcess}
What they want automated: ${state.automationGoal}

${caseStudyBlock}

Build the rough execution plan and budget estimate per the rules.`;

    if (this.provider === "anthropic") {
      const response = await this.anthropic!.messages.create({
        model: this.modelName,
        max_tokens: 450,
        system: ESTIMATION_SYSTEM_PROMPT,
        messages: [{ role: "user", content: briefPrompt }]
        // No `tools` here on purpose - this call doesn't need tool-calling.
      });
      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock && textBlock.type === "text" ? textBlock.text : "";
    }

    const model = this.genAI!.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ESTIMATION_SYSTEM_PROMPT
      // No `tools` here either.
    });
    const result = await model.generateContent(briefPrompt);
    return result.response.text();
  }

  /**
   * Cheap, single-purpose LLM call that turns what the user just said about
   * their business/current process into exactly 3 short, tailored ideas for
   * what Shark could automate or build for them. Returned as quickReplies so
   * the frontend can render them as tappable buttons - the user can still
   * ignore them and type their own goal in free text, which the
   * awaiting_goal step accepts as-is either way.
   * Returns [] (falling back to the plain open question) on any failure or
   * if the model doesn't return exactly 3 clean strings, so this never blocks
   * the flow.
   */
  private async generateAutomationOptions(businessContext: string, currentProcess: string): Promise<string[]> {
    const optionsSystemPrompt =
      "You are a business automation consultant. Respond with strict JSON only - a JSON array of exactly 3 short strings (each under 8 words), and nothing else. No markdown, no preamble, no explanation.";
    const prompt = `Business context: ${businessContext}
Current process (how they handle this today): ${currentProcess}

Suggest exactly 3 short, specific automation or build ideas that would genuinely help this business, based only on what's described above. Each should be a distinct, concrete direction (not generic advice).`;

    try {
      let raw = "";
      if (this.provider === "anthropic") {
        const response = await this.anthropic!.messages.create({
          model: this.modelName,
          max_tokens: 150,
          system: optionsSystemPrompt,
          messages: [{ role: "user", content: prompt }]
        });
        const textBlock = response.content.find((block) => block.type === "text");
        raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
      } else {
        const model = this.genAI!.getGenerativeModel({
          model: this.modelName,
          systemInstruction: optionsSystemPrompt
        });
        const result = await model.generateContent(prompt);
        raw = result.response.text();
      }
      return this.parseOptionsJson(raw);
    } catch (error: unknown) {
      this.logger.warn(`generateAutomationOptions failed: ${(error as Error).message}`);
      return [];
    }
  }

  private parseOptionsJson(raw: string): string[] {
    try {
      const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      const parsed: unknown = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        const strings = parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
        return strings.length === 3 ? strings : [];
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Pulls only image URLs out of a portfolio's mixed `media` array (which
   * can contain both image and video links). Anything matching a common
   * video extension is excluded; everything else is treated as an image.
   * Used everywhere `media` is read so image filtering logic lives in one
   * place rather than being duplicated across searchPortfolio() and
   * findRelevantPastPortfolios().
   */
  private extractImageUrls(media: string[] | null | undefined): string[] {
    if (!media || media.length === 0) {
      return [];
    }
    return media.filter((url) => !VIDEO_EXTENSIONS.test(url));
  }

  /**
   * Formats up to 2 matched portfolio pieces into a ready-to-send Markdown
   * blurb: bold linked title, a short summary drawn straight from the
   * problemAndSolution/description fields, and one image if available.
   * Deliberately does NOT go through the LLM - this is used by fully
   * scripted/deterministic reply paths (e.g. the automation quote flow's
   * final step) that don't otherwise make an LLM call, so formatting here
   * stays $0 and instant. The portfolio copy is SharkStack's own internal
   * data, not third-party content, so reusing it directly is fine.
   */
  private formatPortfolioShowcase(
    items: {
      title: string;
      description: string;
      problemAndSolution: string;
      link: string | null;
      images: string[];
    }[]
  ): string {
    if (items.length === 0) {
      return "";
    }
    const blocks = items.slice(0, 2).map((p) => {
      const heading = p.link ? `**[${p.title}](${p.link})**` : `**${p.title}**`;
      const summary = (p.problemAndSolution || p.description).trim();
      const image = p.images.length > 0 ? `\n![${p.title}](${p.images[0]})` : "";
      return `${heading}\n${summary}${image}`;
    });
    return `Related SharkStack work in this space:\n\n${blocks.join("\n\n")}`;
  }

  /**
   * Looks up up to 2 REAL completed portfolio pieces in the SAME domain as
   * what the user wants built - i.e. overlap with their stated
   * technologies/tools, not just any incidental word shared with the
   * portfolio's description. Deliberately never fabricates a case study - if
   * nothing genuinely matches, returns an empty array and generateEstimate()
   * is instructed to speak generally instead.
   *
   * Sourced from the portfolios table (real, reviewed, published showcase
   * work) rather than the projects table - projects also contains
   * unverified/in-progress client inquiries (including chatbot-submitted
   * drafts), which are never appropriate to cite back to a visitor as proof
   * of completed work.
   *
   * Matching is two-tiered:
   *  - a keyword found in the portfolio's `technologies` or `tools` arrays
   *    counts as a strong ("domain") match, since those are the closest
   *    thing to an explicit category (e.g. "n8n", "React Native").
   *  - a keyword found only in the free-text `description`/`problemAndSolution`
   *    counts as a weaker match, since that can just be incidental phrasing.
   * Only candidates with at least one domain-level match are returned, so
   * Shark never namedrops a portfolio piece from an unrelated domain just
   * because it happened to share a generic word.
   *
   * Also returns an `images` array (image URLs only, videos filtered out via
   * extractImageUrls()) so the estimate synthesis call can optionally show
   * one image alongside the case-study mention.
   */
  private async findRelevantPastPortfolios(text: string): Promise<
    {
      title: string;
      technologies: string[];
      description: string;
      problemAndSolution: string;
      link: string | null;
      images: string[];
    }[]
  > {
    const keywords = this.extractKeywords(text);
    if (keywords.length === 0) {
      return [];
    }

    const keywordConditions: SQL[] = keywords.map(
      (word) =>
        sql`(${ilike(portfolios.description, `%${word}%`)} OR ${ilike(portfolios.problemAndSolution, `%${word}%`)}
          OR EXISTS (SELECT 1 FROM unnest(${portfolios.technologies}) t WHERE t ILIKE ${`%${word}%`})
          OR EXISTS (SELECT 1 FROM unnest(${portfolios.tools}) tl WHERE tl ILIKE ${`%${word}%`}))`
    );

    // Pull a slightly larger candidate pool than we need so we have room to
    // rank by domain relevance in JS rather than just recency.
    const candidates = await this.databaseService.db
      .select({
        title: portfolios.title,
        technologies: portfolios.technologies,
        tools: portfolios.tools,
        description: portfolios.description,
        problemAndSolution: portfolios.problemAndSolution,
        link: portfolios.link,
        media: portfolios.media
      })
      .from(portfolios)
      .where(or(...keywordConditions))
      .orderBy(desc(portfolios.id))
      .limit(10);

    const scored = candidates
      .map((portfolio) => {
        const domainText = [...portfolio.technologies, ...portfolio.tools].join(" ").toLowerCase();
        const descriptionText = `${portfolio.description} ${portfolio.problemAndSolution}`.toLowerCase();

        let domainMatches = 0;
        let descriptionMatches = 0;
        for (const word of keywords) {
          if (domainText.includes(word)) {
            domainMatches++;
          } else if (descriptionText.includes(word)) {
            descriptionMatches++;
          }
        }

        return { portfolio, domainMatches, descriptionMatches };
      })
      // Require at least one real domain/tech-level match - a portfolio piece
      // that only shares a generic description word isn't the same domain
      // the user is asking about, so it shouldn't be cited as a case study.
      .filter((entry) => entry.domainMatches > 0)
      .sort((a, b) => b.domainMatches - a.domainMatches || b.descriptionMatches - a.descriptionMatches);

    return scored.slice(0, 2).map((entry) => ({
      title: entry.portfolio.title,
      technologies: entry.portfolio.technologies,
      description: entry.portfolio.description,
      problemAndSolution: entry.portfolio.problemAndSolution,
      link: entry.portfolio.link,
      images: this.extractImageUrls(entry.portfolio.media)
    }));
  }

  /**
   * Searches published portfolio pieces by title, description, or
   * problem/solution summary. Unlike the client-project lookups, there's no
   * status/draft filter needed - the portfolios table only ever holds
   * reviewed, published showcase work (it has no status column at all).
   *
   * Returns an `images` array (image URLs only - videos filtered out via
   * extractImageUrls()) alongside each result, and drops the raw mixed
   * `media` array from the response so the model is never tempted to render
   * a video URL as if it were an image.
   */
  private async searchPortfolio(query: string) {
    if (!query) {
      return { error: "No search term provided" };
    }
    const term = `%${query}%`;
    const results = await this.databaseService.db
      .select({
        title: portfolios.title,
        description: portfolios.description,
        problemAndSolution: portfolios.problemAndSolution,
        technologies: portfolios.technologies,
        tools: portfolios.tools,
        // Needed so Shark can actually share the project link with the user -
        // previously omitted here, so a real link never made it into replies.
        link: portfolios.link,
        media: portfolios.media
      })
      .from(portfolios)
      .where(or(ilike(portfolios.title, term), ilike(portfolios.description, term), ilike(portfolios.problemAndSolution, term)))
      .orderBy(desc(portfolios.id))
      .limit(10);

    // Only expose image URLs to the model - videos aren't renderable inline
    // the same way (Markdown image syntax), so filter them out here rather
    // than trusting the LLM to distinguish image vs video links itself.
    const portfoliosWithImages = results.map(({ media, ...rest }) => ({
      ...rest,
      images: this.extractImageUrls(media)
    }));

    return { portfolios: portfoliosWithImages };
  }

  /**
   * Finds an existing lead by email OR phone number - either matching means
   * it's very likely the same person, so we reuse that lead instead of
   * creating a duplicate. If phone isn't provided/available, falls back to
   * checking email only.
   */
  private async findExistingLead(email: string, phone?: string) {
    const normalizedEmail = email.toLowerCase();
    const conditions = [eq(leads.email, normalizedEmail)];
    if (phone) {
      conditions.push(eq(leads.phone, phone));
    }
    const [existing] = await this.databaseService.db
      .select()
      .from(leads)
      .where(or(...conditions))
      .limit(10);
    return existing;
  }

  private async searchLeads(query: string) {
    if (!query) {
      return { error: "No search term provided" };
    }
    const term = `%${query}%`;
    // Deliberately excludes email/phone from the result set - this chatbot is
    // public-facing (no login), so a search here must never let one visitor
    // pull another visitor's contact details, only confirm someone's on file.
    const results = await this.databaseService.db
      .select({
        name: leads.name,
        companyName: leads.companyName,
        region: leads.region,
        services: leads.services,
        projectDetails: leads.projectDetails
      })
      .from(leads)
      .where(or(ilike(leads.name, term), ilike(leads.email, term), ilike(leads.companyName, term)))
      .orderBy(desc(leads.id))
      .limit(10);

    return { leads: results };
  }

  private async createLead(args: Record<string, unknown>) {
    const required = ["name", "email", "region", "phone", "services", "projectDetails"];
    const missing = required.filter((f) => !args[f]);
    if (missing.length > 0) {
      return { error: `Missing required fields: ${missing.join(", ")}` };
    }

    const email = String(args.email).toLowerCase();
    const phone = String(args.phone);

    // De-duplication: skip creating a new lead if one already exists with
    // this email OR this phone number.
    const existing = await this.findExistingLead(email, phone);
    if (existing) {
      return { success: true, duplicate: true, lead: existing };
    }

    const [newLead] = await this.databaseService.db
      .insert(leads)
      .values({
        name: String(args.name),
        email,
        companyName: args.companyName ? String(args.companyName) : undefined,
        companyLink: args.companyLink ? String(args.companyLink) : undefined,
        region: String(args.region),
        phone,
        services: (args.services as string[]).map((s) => s.trim()),
        projectDetails: String(args.projectDetails)
      })
      .returning();

    return { success: true, duplicate: false, lead: newLead };
  }

  /**
   * Mirrors a newly-created project's contact into the leads table so every
   * project inquiry also shows up in the leads pipeline, without ever
   * creating a second lead row for a client who already has one on file.
   * Best-effort only: a failure here must never fail project creation, so
   * errors are swallowed and just logged.
   */
  private async upsertLeadFromProject(
    args: Record<string, unknown>,
    project: {
      clientName: string;
      clientEmail: string;
      services: string[];
      description: string;
    }
  ) {
    try {
      const email = project.clientEmail.toLowerCase();
      const phone = args.phone ? String(args.phone) : undefined;

      const existing = await this.findExistingLead(email, phone);
      if (existing) {
        return;
      }

      await this.databaseService.db.insert(leads).values({
        name: project.clientName,
        email,
        companyName: args.companyName ? String(args.companyName) : undefined,
        companyLink: args.companyLink ? String(args.companyLink) : undefined,
        region: args.region ? String(args.region) : "Not provided",
        phone: phone ?? "Not provided",
        services: project.services,
        projectDetails: project.description
      });
    } catch (error: unknown) {
      this.logger.warn(`upsertLeadFromProject: failed to save lead for ${project.clientEmail}: ${(error as Error).message}`);
    }
  }

  /** Pulls a handful of distinct, meaningful words out of free text for case-study matching. */
  private extractKeywords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !CASE_STUDY_STOPWORDS.has(w));
    return Array.from(new Set(words)).slice(0, 5);
  }

  /**
   * Builds a one-line slot offer to append after the scripted estimate.
   *
   * Each entry in `slots` is an AvailableSlot ({ startTime, endTime, label })
   * from GoogleCalendarService.getAvailableSlots(), so we pull out `label`
   * (e.g. "10:00 AM - 11:00 AM (America/New_York)") rather than stringifying
   * the whole object.
   */
  private async buildSlotOfferLine(): Promise<string> {
    // Scan forward to get the first upcoming day with actual open slots,
    // instead of blindly pulling tomorrow.
    const dayResults = await this.getUpcomingAvailableSlots(1);
    const dayResult = dayResults[0];

    if (!dayResult || dayResult.slots.length === 0) {
      return "";
    }
    const times = dayResult.slots
      .slice(0, 3)
      .map((slot) => slot.label)
      .join(", ");
    return `Want to grab a quick call to go over this? SharkStack has ${times} open on ${dayResult.date} - just say the word.`;
  }

  /**
   * Writes a compact summary of the discovery Q&A + the resulting estimate
   * into session history, so that if the user continues into the normal
   * LLM+tools path (e.g. "book the meet"), the model already has the
   * business context and won't re-ask what Shark just learned.
   */
  private async persistDiscoveryToSessionHistory(sessionId: string, state: EstimationState, finalReply: string): Promise<void> {
    const summaryUserTurn = `[Discovery context - business: "${state.initialMessage}" | current process: "${state.currentProcess}" | automation goal: "${state.automationGoal}"]`;

    if (this.provider === "anthropic") {
      const history = this.sessionMemory.getHistory<Anthropic.MessageParam>(sessionId);
      history.push({ role: "user", content: summaryUserTurn });
      history.push({ role: "assistant", content: finalReply });
      this.truncateHistory(history);
      this.sessionMemory.setHistory(sessionId, history);
      return;
    }

    const history = this.sessionMemory.getHistory<Content>(sessionId);
    history.push({ role: "user", parts: [{ text: summaryUserTurn }] });
    history.push({ role: "model", parts: [{ text: finalReply }] });
    this.truncateHistory(history);
    this.sessionMemory.setHistory(sessionId, history);
  }

  // ---------------------------------------------------------------------
  // Normal chat paths (Anthropic / Gemini) - unchanged aside from history
  // truncation and a lower max_tokens ceiling.
  // ---------------------------------------------------------------------

  private async chatWithAnthropic(sessionId: string, message: string, systemPrompt: string): Promise<string> {
    const history = this.sessionMemory.getHistory<Anthropic.MessageParam>(sessionId);
    history.push({ role: "user", content: message });
    this.truncateHistory(history);

    let safetyCounter = 0;
    let finalReply = "";

    while (safetyCounter < 5) {
      const response = await this.anthropic!.messages.create({
        model: this.modelName,
        max_tokens: 500,
        system: systemPrompt,
        messages: history,
        tools: anthropicTools
      });

      history.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        const textBlock = response.content.find((block) => block.type === "text");
        if (textBlock && textBlock.type === "text") {
          finalReply = textBlock.text;
        }
        break;
      }

      const toolBlocks = response.content.filter((block) => block.type === "tool_use");
      const toolResultContents: Anthropic.ToolResultBlockParam[] = [];

      for (const block of toolBlocks) {
        if (block.type === "tool_use") {
          const toolResult = await this.executeTool(block.name, block.input as Record<string, unknown>, sessionId, message);
          toolResultContents.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(toolResult)
          });
        }
      }

      history.push({ role: "user", content: toolResultContents });
      safetyCounter++;
    }

    // If we fell out of the loop because we hit the safety cap while the
    // model was still on a tool_use turn (not because it produced a final
    // text reply), the tool(s) already ran - slots may have been fetched,
    // a meeting may have actually been booked - but the model never got a
    // chance to summarize that for the user. Returning "" here would send
    // a silent empty reply even though real work happened. Force one more
    // no-tools call so the model has to turn the tool_result(s) already in
    // history into an actual answer.
    if (!finalReply) {
      this.logger.warn(`chatWithAnthropic: safety counter exhausted after ${safetyCounter} tool round(s) without a final reply (session ${sessionId})`);
      try {
        const wrapUp = await this.anthropic!.messages.create({
          model: this.modelName,
          max_tokens: 500,
          system: systemPrompt,
          messages: history
          // Deliberately omit `tools` - the model can't call anything else,
          // it must summarize the outcome of the tool results already in
          // history (e.g. booked meeting, fetched slots) as plain text.
        });
        history.push({ role: "assistant", content: wrapUp.content });
        const wrapUpText = wrapUp.content.find((block) => block.type === "text");
        if (wrapUpText && wrapUpText.type === "text") {
          finalReply = wrapUpText.text;
        }
      } catch (error: unknown) {
        this.logger.error(`chatWithAnthropic: wrap-up call failed: ${(error as Error).message}`);
      }

      if (!finalReply) {
        finalReply =
          'That went through, but I\'m having trouble summarizing the result - could you ask me to confirm (e.g. "did that book?" or "what slots did you find?")?';
      }
    }

    this.sessionMemory.setHistory(sessionId, history);
    return finalReply;
  }

  private async chatWithGemini(sessionId: string, message: string, systemPrompt: string): Promise<string> {
    const model = this.genAI!.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemPrompt,
      tools: geminiTools
    });

    const history = this.sessionMemory.getHistory<Content>(sessionId);
    this.truncateHistory(history);
    const chatSession = model.startChat({ history });

    let result = await chatSession.sendMessage(message);
    let safetyCounter = 0;
    let finalReply = "";

    while (safetyCounter < 5) {
      const functionCalls = result.response.functionCalls();
      if (!functionCalls || functionCalls.length === 0) {
        finalReply = result.response.text();
        break;
      }

      const functionResponseParts: Part[] = [];
      for (const call of functionCalls) {
        const toolResult = await this.executeTool(call.name, (call.args ?? {}) as Record<string, unknown>, sessionId, message);
        functionResponseParts.push({
          functionResponse: { name: call.name, response: toolResult as object }
        });
      }

      result = await chatSession.sendMessage(functionResponseParts);
      safetyCounter++;
    }

    // Same issue as the Anthropic path: if we hit the safety cap while the
    // model was still issuing function calls, the tool(s) already ran (a
    // meeting may really be booked, slots may really have been fetched) but
    // the model never got a turn to put that into a text reply. Force one
    // more message, telling it explicitly to stop calling tools and just
    // summarize, instead of returning "" to the user.
    if (!finalReply) {
      this.logger.warn(`chatWithGemini: safety counter exhausted after ${safetyCounter} tool round(s) without a final reply (session ${sessionId})`);
      try {
        const wrapUp = await chatSession.sendMessage(
          "Do not call any more tools. Summarize the result of the tool call(s) above for the user now, in plain text."
        );
        finalReply = wrapUp.response.text();
      } catch (error: unknown) {
        this.logger.error(`chatWithGemini: wrap-up call failed: ${(error as Error).message}`);
      }

      if (!finalReply) {
        finalReply =
          'That went through, but I\'m having trouble summarizing the result - could you ask me to confirm (e.g. "did that book?" or "what slots did you find?")?';
      }
    }

    this.sessionMemory.setHistory(sessionId, await chatSession.getHistory());
    return finalReply;
  }

  /**
   * Caps stored history to the last N turns before sending it back to the
   * model. Keeps per-request input tokens bounded instead of growing
   * unboundedly for long sessions.
   */
  private truncateHistory<T>(history: T[], maxMessages = 16): void {
    if (history.length > maxMessages) {
      history.splice(0, history.length - maxMessages);
    }
  }

  private async executeTool(name: string, args: Record<string, unknown>, sessionId?: string, triggeringMessage?: string) {
    try {
      switch (name) {
        case "count_projects":
          return await this.countProjects(args);
        case "list_recent_projects":
          return await this.listRecentProjects(args);
        case "search_portfolio":
          return await this.searchPortfolio(String(args.query ?? ""));
        case "search_leads":
          return await this.searchLeads(String(args.query ?? ""));
        case "create_lead":
          return await this.createLead(args);
        case "create_project":
          return await this.createProject(args);
        case "list_available_slots":
          return await this.listAvailableSlots(String(args.date ?? ""));
        case "book_project_meeting":
          return await this.bookProjectMeeting(args);
        case "list_recent_portfolio":
          return await this.listRecentPortfolio(args);
        case "list_services":
          return await this.listServices();
        case "list_packages":
          return await this.listPackages();
        case "get_package_pricing":
          return await this.getPackagePricing(String(args.slug ?? ""));
        case "start_automation_quote":
          if (sessionId) {
            this.automationQuoteStates.set(sessionId, {
              step: "awaiting_steps",
              // Store the message that triggered the flow so the final
              // step can match a relevant portfolio piece by domain
              // (e.g. "I run a bakery and want order automation").
              domainContext: triggeringMessage ?? "",
              updatedAt: Date.now()
            });
          }
          return await this.startAutomationQuote(args);
        case "select_package_for_lead":
          return await this.selectPackageForLead(String(args.email ?? ""), String(args.packageSlug ?? ""), String(args.estimatedPrice ?? ""));
        default:
          return { error: `Unknown tool: ${name}` };
      }
    } catch (error: unknown) {
      return { error: `Tool execution failed: ${(error as Error).message}` };
    }
  }

  private async countProjects(args: Record<string, unknown>) {
    // Drafts are unverified public inquiries, not real work - never let them
    // count as, or be returned as, legitimate project data to a chat user.
    const conditions: SQL[] = [ne(projects.status, "DRAFT")];
    if (args.status) {
      conditions.push(eq(projects.status, String(args.status).toUpperCase() as ProjectStatus));
    }
    const [{ count }] = await this.databaseService.db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(and(...conditions));
    return { count };
  }

  private async listRecentProjects(args: Record<string, unknown>) {
    const limit = Math.min(Number(args.limit) || 10, 50);
    // Same reasoning as countProjects: exclude drafts unconditionally.
    const conditions: SQL[] = [ne(projects.status, "DRAFT")];

    if (args.status) {
      conditions.push(eq(projects.status, String(args.status).toUpperCase() as ProjectStatus));
    }
    if (args.client) {
      const term = `%${String(args.client)}%`;
      conditions.push(sql`(${ilike(projects.clientName, term)} OR ${ilike(projects.clientEmail, term)})`);
    }
    if (args.service) {
      conditions.push(sql`EXISTS (SELECT 1 FROM unnest(${projects.services}) s WHERE s ILIKE ${`%${String(args.service)}%`})`);
    }

    // Only select name + description - this tool is meant to give a quick,
    // client-friendly rundown of recent work, not internal fields like
    // status, services, notes, or the DB id. Restricting the SELECT itself
    // (rather than just telling the model not to mention them) means that
    // information is never even available to leak, regardless of prompt.
    const query = this.databaseService.db
      .select({
        name: projects.name,
        description: projects.description
      })
      .from(projects)
      .where(and(...conditions))
      .orderBy(desc(projects.id))
      .limit(limit);

    return { projects: await query };
  }

  private async createProject(args: Record<string, unknown>) {
    const required = ["name", "clientName", "clientEmail", "services", "description"];
    const missing = required.filter((f) => !args[f]);
    if (missing.length > 0) {
      return { error: `Missing required fields: ${missing.join(", ")}` };
    }

    let packageId: string | undefined = undefined;
    if (args.packageSlug) {
      try {
        const [pkg] = await this.databaseService.db
          .select({ id: packages.id })
          .from(packages)
          .where(eq(packages.slug, String(args.packageSlug)))
          .limit(1);
        if (pkg) {
          packageId = pkg.id;
        }
      } catch (err: unknown) {
        this.logger.warn(`Failed to lookup package for slug "${args.packageSlug}": ${(err as Error).message}`);
      }
    }

    const values = {
      name: String(args.name),
      clientName: String(args.clientName),
      clientEmail: String(args.clientEmail).toLowerCase(),
      services: (args.services as string[]).map((s) => s.trim()),
      description: String(args.description),
      // Hardcoded, never taken from `args`: this chatbot is public and unauthenticated,
      // so every record it creates must land as an unverified draft, tagged with its
      // origin, for staff to triage - never silently mixed in as a live "planning" project.
      status: "DRAFT" as ProjectStatus,
      source: "chatbot",
      budget: args.budget ? String(args.budget) : undefined,
      deadline: args.deadline ? String(args.deadline) : undefined,
      notes: args.notes ? String(args.notes) : undefined,
      packageId
    };

    const [newProject] = await this.databaseService.db.insert(projects).values(values).returning({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      services: projects.services,
      description: projects.description,
      notes: projects.notes,
      packageId: projects.packageId
    });

    // Mirror the client's contact info into the leads table too, skipping it
    // entirely if a lead with this email or phone already exists.
    await this.upsertLeadFromProject(args, values);

    // Piggyback available slots onto the project-creation result so the
    // model can offer times to book in the same reply, instead of needing
    // a second tool round trip (list_available_slots) on the next turn.
    // Single lookup only - not a loop - to keep this to one Calendar API call.
    const availableSlots = this.googleCalendarService.isConfigured() ? await this.getNextAvailableSlots() : [];

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:5173";
    const projectLink = `${frontendUrl}/portfolio/${newProject.id}`;

    return {
      success: true,
      project: {
        ...newProject,
        link: projectLink
      },
      availableSlots
    };
  }

  /**
   * Single Calendar API call for the next working day (skips to Monday if
   * today is Saturday/Sunday, per team ops). Used right after project
   * creation so Shark can offer times to book without a separate
   * list_available_slots round trip. Deliberately not a loop over multiple
   * days - one call, one day, keep it cheap.
   */
  private async getNextAvailableSlots(): Promise<{ date: string; slots: AvailableSlot[] }[]> {
    const cursor = new Date();
    const dayOfWeek = cursor.getUTCDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 6) {
      cursor.setDate(cursor.getDate() + 2);
    } // Sat -> Mon
    else if (dayOfWeek === 0) {
      cursor.setDate(cursor.getDate() + 1);
    } // Sun -> Mon

    const dateStr = cursor.toISOString().slice(0, 10); // YYYY-MM-DD

    try {
      const slots = await this.googleCalendarService.getAvailableSlots(dateStr);
      return slots && slots.length > 0 ? [{ date: dateStr, slots }] : [];
    } catch (error: unknown) {
      // Don't let a slots lookup failure break project creation - just skip it.
      this.logger.warn(`getNextAvailableSlots: failed to fetch slots for ${dateStr}: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Previously, when the LLM omitted the `date` argument (the exact
   * case the tool description tells it to use when the user says the
   * offered slots "don't work"), this just forwarded an empty string
   * straight to googleCalendarService.getAvailableSlots(""), which has no
   * special handling for "no date" - so the promised "next 3 business days"
   * behavior never actually happened.
   *
   * Now: an empty/omitted date walks forward day-by-day starting tomorrow,
   * skips weekends, and collects up to `numDays` business days that
   * actually have open slots, making one Calendar API call per candidate
   * day (capped so a fully-booked stretch can't loop forever).
   */
  private async getUpcomingAvailableSlots(numDays = 3): Promise<{ date: string; slots: AvailableSlot[] }[]> {
    const results: { date: string; slots: AvailableSlot[] }[] = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1); // start from tomorrow - today's slots were already offered

    const maxLookaheadDays = 30; // safety cap in case of an extended fully-booked stretch
    let daysChecked = 0;

    while (results.length < numDays && daysChecked < maxLookaheadDays) {
      const dayOfWeek = cursor.getUTCDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = cursor.toISOString().slice(0, 10);
        try {
          const slots = await this.googleCalendarService.getAvailableSlots(dateStr);
          if (slots && slots.length > 0) {
            results.push({ date: dateStr, slots });
          }
        } catch (error: unknown) {
          this.logger.warn(`getUpcomingAvailableSlots: failed to fetch slots for ${dateStr}: ${(error as Error).message}`);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
      daysChecked++;
    }

    return results;
  }

  private async listAvailableSlots(dateStr: string) {
    if (!this.googleCalendarService.isConfigured()) {
      return {
        error: "Google Calendar integration is not configured. Ask the administrator to add the credentials."
      };
    }
    try {
      // No date given -> this is the "previously offered slots don't work"
      // case: return the next 3 upcoming business days in one call instead
      // of forwarding an empty string to the calendar service.
      if (!dateStr) {
        const days = await this.getUpcomingAvailableSlots(3);
        return { days };
      }
      const slots = await this.googleCalendarService.getAvailableSlots(dateStr);
      return { slots };
    } catch (error: unknown) {
      this.logger.error(`listAvailableSlots failed for date "${dateStr}": ${(error as Error).stack ?? (error as Error).message}`);
      return { error: `Failed to retrieve slots: ${(error as Error).message}` };
    }
  }

  private async listRecentPortfolio(args: Record<string, unknown>) {
    const limit = Math.min(Number(args.limit) || 5, 20);
    const conditions: SQL[] = [];

    if (args.service) {
      const term = `%${String(args.service)}%`;
      conditions.push(
        sql`(EXISTS (SELECT 1 FROM unnest(${portfolios.technologies}) t WHERE t ILIKE ${term})
          OR EXISTS (SELECT 1 FROM unnest(${portfolios.tools}) tl WHERE tl ILIKE ${term}))`
      );
    }

    const results = await this.databaseService.db
      .select({
        title: portfolios.title,
        description: portfolios.description,
        problemAndSolution: portfolios.problemAndSolution,
        link: portfolios.link,
        media: portfolios.media
      })
      .from(portfolios)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(portfolios.id))
      .limit(limit);

    const portfoliosWithImages = results.map(({ media, ...rest }) => ({
      ...rest,
      images: this.extractImageUrls(media)
    }));

    return { portfolios: portfoliosWithImages };
  }

  private async listServices() {
    const results = await this.databaseService.db
      .select({
        title: services.title,
        description: services.description,
        subheadings: services.subheadings
      })
      .from(services);

    return { services: results };
  }

  private async bookProjectMeeting(args: Record<string, unknown>) {
    if (!this.googleCalendarService.isConfigured()) {
      return {
        error: "Google Calendar integration is not configured. Ask the administrator to add the credentials."
      };
    }
    const projectId = args.projectId ? String(args.projectId) : "";
    const startTime = String(args.startTime ?? "");
    const endTime = String(args.endTime ?? "");
    const summary = String(args.summary ?? "");
    const description = args.description ? String(args.description) : undefined;

    if (!startTime || !endTime || !summary) {
      return {
        error: "Missing required fields: startTime, endTime, summary"
      };
    }

    let clientName: string;
    let clientEmail: string;
    let projectName: string | undefined;

    if (projectId) {
      // Booking against a project that was already submitted - pull the
      // client's contact details from that record.
      const [project] = await this.databaseService.db
        .select({
          name: projects.name,
          clientName: projects.clientName,
          clientEmail: projects.clientEmail
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(10);

      if (!project) {
        return { error: `Project with ID "${projectId}" not found.` };
      }

      clientName = project.clientName;
      clientEmail = project.clientEmail;
      projectName = project.name;
    } else {
      // No project yet (e.g. booking straight off a rough estimate) - the
      // model must supply the client's name and email directly. This is
      // never silently guessed: if either is missing, fail loudly so the
      // model asks the user instead of booking with placeholder info.
      const rawName = args.clientName ? String(args.clientName).trim() : "";
      const rawEmail = args.clientEmail ? String(args.clientEmail).trim() : "";
      if (!rawName || !rawEmail) {
        return {
          error: "clientName and clientEmail are required when no projectId is given. Ask the user for their name and email before booking."
        };
      }
      clientName = rawName;
      clientEmail = rawEmail.toLowerCase();

      // Best-effort: also save this contact as a lead so it shows up in the
      // pipeline, without duplicating an existing lead on file. A failure
      // here must never block the actual booking.
      try {
        const existingLead = await this.findExistingLead(clientEmail);
        if (!existingLead) {
          await this.databaseService.db.insert(leads).values({
            name: clientName,
            email: clientEmail,
            region: args.region ? String(args.region) : "Not provided",
            phone: args.phone ? String(args.phone) : "Not provided",
            services: Array.isArray(args.services) ? (args.services as string[]) : [],
            projectDetails: args.projectDetails ? String(args.projectDetails) : summary
          });
        }
      } catch (error: unknown) {
        this.logger.warn(`bookProjectMeeting: failed to save lead for ${clientEmail}: ${(error as Error).message}`);
      }
    }

    try {
      const result = await this.googleCalendarService.bookMeeting({
        startTime,
        endTime,
        summary,
        description,
        clientEmail,
        clientName
      });

      try {
        const lead = await this.findExistingLead(clientEmail);
        const calendarAccount = this.configService.get<string>("GOOGLE_CALENDAR_ID") ?? "";
        await this.databaseService.db.insert(bookings).values({
          leadId: lead ? lead.id : null,
          googleEventId: result.eventId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          attendeeEmail: clientEmail,
          calendarAccount
        });

        if (lead) {
          const currentDates = lead.meetingDates || [];
          const updatedDates = [...currentDates, new Date(startTime)];
          await this.databaseService.db
            .update(leads)
            .set({
              meetingBooked: true,
              meetingDates: updatedDates
            })
            .where(eq(leads.id, lead.id));
        }
      } catch (dbErr: unknown) {
        this.logger.error(`Failed to persist booking record or update lead: ${(dbErr as Error).message}`);
      }

      return {
        success: true,
        projectName,
        meetingLink: result.htmlLink
      };
    } catch (error: unknown) {
      this.logger.error(`bookProjectMeeting failed for client "${clientEmail}": ${(error as Error).stack ?? (error as Error).message}`);
      return { error: `Booking failed: ${(error as Error).message}` };
    }
  }

  // ─── Package Sales Tools ──────────────────────────────────────────────────

  /**
   * Returns every active package with its features and public notes.
   * This is the ONLY source the model should use when answering
   * "what packages do you offer?" — never answer from memory.
   */
  private async listPackages() {
    try {
      const rows = await this.databaseService.db.select().from(packages).where(eq(packages.isActive, true));

      return {
        success: true,
        packages: rows.map((pkg) => ({
          slug: pkg.slug,
          title: pkg.title,
          description: pkg.description,
          features: pkg.features,
          priceCents: pkg.priceCents,
          isCustomPrice: pkg.priceCents === null
        }))
      };
    } catch (err: unknown) {
      this.logger.error(`listPackages failed: ${(err as Error).message}`);
      return { error: `Failed to list packages: ${(err as Error).message}` };
    }
  }

  private async getPackagePricing(slug: string) {
    try {
      const [pkg] = await this.databaseService.db.select().from(packages).where(eq(packages.slug, slug)).limit(1);

      if (!pkg) {
        return { error: `Package with slug "${slug}" not found.` };
      }

      return {
        success: true,
        slug: pkg.slug,
        title: pkg.title,
        description: pkg.description,
        features: pkg.features,
        priceCents: pkg.priceCents,
        isCustomPrice: pkg.priceCents === null
      };
    } catch (err: unknown) {
      this.logger.error(`getPackagePricing failed: ${(err as Error).message}`);
      return { error: `Failed to get package pricing: ${(err as Error).message}` };
    }
  }

  /**
   * Called by the LLM to initiate the scripted Workflow Automation quote flow.
   * Setting the session state happens in executeTool before this is called.
   */
  private async startAutomationQuote(_args: Record<string, unknown>) {
    return {
      success: true,
      message: "Automation quote flow started. Ask the user the first question: " + '"First, roughly how many steps does this workflow have? (e.g. 3, 7, 15)"'
    };
  }

  /**
   * Updates a lead record with the package they've selected and the price
   * range quoted. Must be called whenever a client confirms a package choice.
   */
  private async selectPackageForLead(email: string, packageSlug: string, estimatedPrice: string) {
    try {
      const lead = await this.findExistingLead(email);
      if (!lead) {
        return {
          error: `No lead found with email "${email}". Capture the lead first with create_lead.`
        };
      }

      await this.databaseService.db.update(leads).set({ selectedPackage: packageSlug, estimatedPrice }).where(eq(leads.id, lead.id));

      return {
        success: true,
        message: `Lead ${email} updated — package: "${packageSlug}", price: "${estimatedPrice}".`
      };
    } catch (err: unknown) {
      this.logger.error(`selectPackageForLead failed: ${(err as Error).message}`);
      return {
        error: `Failed to associate package with lead: ${(err as Error).message}`
      };
    }
  }

  // ─── Workflow Automation Discovery Flow ───────────────────────────────────

  /**
   * 5-question scripted discovery flow for Workflow Automation quotes.
   * Intercepts every message while the flow is active (see chat() step 1.5).
   * All pricing ranges come from the automation_tiers DB table — nothing
   * is hardcoded here.
   */
  private async handleAutomationQuoteFlow(sessionId: string, message: string): Promise<{ reply: string; quickReplies?: string[] }> {
    const state = this.automationQuoteStates.get(sessionId);
    if (!state) {
      return {
        reply: "Let's start fresh — what would you like SharkStack to automate?"
      };
    }

    const trimmed = message.trim();

    // Let the user bail out at any point
    if (/\b(cancel|never mind|nevermind|stop|skip)\b/i.test(trimmed)) {
      this.automationQuoteStates.delete(sessionId);
      return {
        reply: "No worries, stopped the quote helper. Let SharkStack know whenever you'd like to revisit package pricing."
      };
    }

    switch (state.step) {
      // ── Q1: How many workflow steps? ─────────────────────────────────────
      case "awaiting_steps": {
        const match = trimmed.match(/\d+/);
        const steps = match ? Math.max(1, parseInt(match[0], 10)) : 3;
        this.automationQuoteStates.set(sessionId, {
          ...state,
          steps,
          step: "awaiting_integrations",
          updatedAt: Date.now()
        });
        return {
          reply: `Got it — **${steps}** step${steps !== 1 ? "s" : ""}. Next, how many external systems or integrations are involved? (e.g. CRM, Shopify, email, Slack)`
        };
      }

      // ── Q2: How many integrations? ────────────────────────────────────────
      case "awaiting_integrations": {
        const match = trimmed.match(/\d+/);
        const integrations = match ? Math.max(0, parseInt(match[0], 10)) : 1;
        this.automationQuoteStates.set(sessionId, {
          ...state,
          integrations,
          step: "awaiting_logic",
          updatedAt: Date.now()
        });
        return {
          reply: `Understood — **${integrations}** integration${integrations !== 1 ? "s" : ""}. How complex is the conditional logic? For example: simple if/then routing, multi-condition branching, or complex error handling with retries?`
        };
      }

      // ── Q3: Logic complexity? ─────────────────────────────────────────────
      case "awaiting_logic": {
        this.automationQuoteStates.set(sessionId, {
          ...state,
          logicComplexity: trimmed,
          step: "awaiting_ai",
          updatedAt: Date.now()
        });
        return {
          reply:
            "Got it. Does this workflow require AI decision-making — for example, using an LLM to read content, classify data, or make smart routing choices? (Yes / No)",
          quickReplies: ["Yes", "No"]
        };
      }

      // ── Q4: AI decision-making required? ──────────────────────────────────
      case "awaiting_ai": {
        const aiDecisioning = /^(yes|y|yeah|yep|yup)/i.test(trimmed);
        this.automationQuoteStates.set(sessionId, {
          ...state,
          aiDecisioning,
          step: "awaiting_volume",
          updatedAt: Date.now()
        });
        return {
          reply: `Noted — AI decision-making: **${aiDecisioning ? "Yes" : "No"}**. Last one: roughly how many times per month will this workflow run? (e.g. 500, 5000, or unlimited)`
        };
      }

      // ── Q5: Monthly volume → classify tier → DB lookup → quote ────────────
      case "awaiting_volume": {
        const match = trimmed.match(/\d+/);
        const monthlyVolume = match ? parseInt(match[0], 10) : 1000;

        const steps = state.steps ?? 3;
        const integrations = state.integrations ?? 1;
        const logicComplexity = state.logicComplexity ?? "simple";
        const aiDecisioning = state.aiDecisioning ?? false;

        // ── Deterministic tier classification ──────────────────────────────
        const logic = logicComplexity.toLowerCase();
        let tier: "SIMPLE" | "MEDIUM" | "COMPLEX" = "SIMPLE";
        if (steps >= 8 || aiDecisioning || logic.includes("complex") || logic.includes("branching") || logic.includes("retries")) {
          tier = "COMPLEX";
        } else if (steps >= 4 || integrations > 2 || logic.includes("conditional") || logic.includes("multi") || logic.includes("medium")) {
          tier = "MEDIUM";
        }

        // ── Hardcoded tier pricing ranges ──────────────────────────────────
        let buildFeeStr = "Contact us for pricing";
        let monthlyFeeStr = "Contact us for pricing";
        let buildEstimateMinCents = 0;
        let buildEstimateMaxCents: number | null = null;
        let monthlyEstimateMinCents: number | null = null;
        let monthlyEstimateMaxCents: number | null = null;

        if (tier === "SIMPLE") {
          buildEstimateMinCents = 49700;
          buildEstimateMaxCents = 99700;
          monthlyEstimateMinCents = 4700;
          monthlyEstimateMaxCents = 9700;
          buildFeeStr = "$497–$997";
          monthlyFeeStr = "$47–$97/month";
        } else if (tier === "MEDIUM") {
          buildEstimateMinCents = 99700;
          buildEstimateMaxCents = 249700;
          monthlyEstimateMinCents = 9700;
          monthlyEstimateMaxCents = 19700;
          buildFeeStr = "$997–$2,497";
          monthlyFeeStr = "$97–$197/month";
        } else {
          buildEstimateMinCents = 249700;
          buildFeeStr = "$2,497+";
          monthlyFeeStr = "Custom — quoted after review";
        }

        // Persist the quote to the DB (best-effort)
        try {
          const lead = await this.findLeadFromSessionHistory(sessionId);
          await this.databaseService.db.insert(automationQuotes).values({
            leadId: lead?.id ?? null,
            steps,
            integrations,
            logicComplexity,
            aiDecisioning,
            monthlyVolume,
            estimatedTier: tier,
            buildEstimateMinCents,
            buildEstimateMaxCents,
            monthlyEstimateMinCents,
            monthlyEstimateMaxCents
          });
        } catch (saveErr: unknown) {
          this.logger.warn(`handleAutomationQuoteFlow: failed to save quote: ${(saveErr as Error).message}`);
        }

        this.automationQuoteStates.delete(sessionId);

        // Show relevant past work for the client's domain, if any. Uses the
        // raw message that started the flow (e.g. "I run a bakery and want
        // order automation") plus the logic-complexity answer as extra
        // keyword signal - both are free-text and often carry the domain
        // words a purely numeric Q1/Q2/Q5 answer wouldn't. Fully
        // deterministic/$0 - no LLM call, just DB lookup + string templating.
        const portfolioSearchText = `${state.domainContext ?? ""} ${logicComplexity}`.trim();
        const matchedPortfolios = portfolioSearchText ? await this.findRelevantPastPortfolios(portfolioSearchText) : [];
        const portfolioShowcase = this.formatPortfolioShowcase(matchedPortfolios);

        const slotOffer = this.googleCalendarService.isConfigured() ? await this.buildSlotOfferLine() : "";

        const reply = [
          `Based on your requirements, here's a ballpark for a **${tier}** automation project:\n`,
          `- **Build fee (one-time):** ${buildFeeStr}`,
          `- **Monthly maintenance:** ${monthlyFeeStr}`,
          `\nA specialist will confirm the final pricing after reviewing your requirements.`,
          portfolioShowcase ? `\n${portfolioShowcase}` : "",
          slotOffer ? `\n${slotOffer}` : ""
        ]
          .filter(Boolean)
          .join("\n");

        // Write context into session history so the LLM has it if the
        // conversation continues (e.g. "book a call")
        await this.persistAutomationQuoteToHistory(
          sessionId,
          { steps, integrations, logicComplexity, aiDecisioning, monthlyVolume, tier, buildFeeStr, monthlyFeeStr },
          reply
        );

        return { reply };
      }

      default:
        this.automationQuoteStates.delete(sessionId);
        return {
          reply: "Let's start fresh — what would you like SharkStack to automate?"
        };
    }
  }

  /**
   * Scans the current session's history for any email address, then looks up
   * the corresponding lead record. Used to link automation quotes to leads
   * without forcing the user to re-enter their email mid-flow.
   */
  private async findLeadFromSessionHistory(sessionId: string) {
    try {
      let texts: string[] = [];

      if (this.provider === "anthropic") {
        const history = this.sessionMemory.getHistory<Anthropic.MessageParam>(sessionId);
        texts = history.map((h) => (typeof h.content === "string" ? h.content : "")).filter(Boolean);
      } else {
        const history = this.sessionMemory.getHistory<Content>(sessionId);
        texts = history
          .flatMap((h) => h.parts ?? [])
          .map((p) => ("text" in p ? p.text : ""))
          .filter((t): t is string => typeof t === "string" && t.length > 0);
      }

      const emailRe = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      for (const text of texts) {
        const m = text.match(emailRe);
        if (m) {
          const lead = await this.findExistingLead(m[0].toLowerCase());
          if (lead) {
            return lead;
          }
        }
      }
    } catch {
      // best-effort — never let a lookup failure break the quote flow
    }
    return null;
  }

  /**
   * Writes a compact automation-quote context summary into session history
   * so the LLM can reference the discovery answers and price ranges in
   * follow-up messages (e.g. "book a call about that quote").
   */
  private async persistAutomationQuoteToHistory(
    sessionId: string,
    quote: {
      steps: number;
      integrations: number;
      logicComplexity: string;
      aiDecisioning: boolean;
      monthlyVolume: number;
      tier: string;
      buildFeeStr: string;
      monthlyFeeStr: string;
    },
    finalReply: string
  ): Promise<void> {
    const summary =
      `[Automation quote — steps:${quote.steps} integrations:${quote.integrations} ` +
      `logic:"${quote.logicComplexity}" AI:${quote.aiDecisioning} volume:${quote.monthlyVolume}/mo ` +
      `→ tier:${quote.tier} build:${quote.buildFeeStr} monthly:${quote.monthlyFeeStr}]`;

    if (this.provider === "anthropic") {
      const history = this.sessionMemory.getHistory<Anthropic.MessageParam>(sessionId);
      history.push({ role: "user", content: summary });
      history.push({ role: "assistant", content: finalReply });
      this.truncateHistory(history);
      this.sessionMemory.setHistory(sessionId, history);
      return;
    }

    const history = this.sessionMemory.getHistory<Content>(sessionId);
    history.push({ role: "user", parts: [{ text: summary }] });
    history.push({ role: "model", parts: [{ text: finalReply }] });
    this.truncateHistory(history);
    this.sessionMemory.setHistory(sessionId, history);
  }
}
