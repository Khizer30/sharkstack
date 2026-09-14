import { supportEmail } from "./site";

export const careerHeroContent = {
  heading: "Become a Shark.",
  sub: "We're an engineering studio that designs and builds AI-powered software for ambitious teams worldwide. We value technical craft, ownership, and shipping over process.",
  linkPrimary: { label: "How to get started", target: "process" },
  linkSecondary: { label: "View open roles", target: "roles" }
};

export const careerMarqueeContent = {
  items: ["Become A Shark", "✦", "We Are Hiring", "✦", "Join The Crew", "✦"]
};

export const careerFocusContent = {
  cards: [
    {
      id: "engineering",
      title: "Engineering",
      desc: "Ship fast, sharp, production code across the full stack — no bloated process standing between you and real impact.",
      ctaLabel: "View openings",
      target: "roles",
      icon: "laptop",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
      alt: "Engineer working on laptop code"
    },
    {
      id: "design",
      title: "Design",
      desc: "Turn ambitious ideas into interfaces people love — craft, motion, and systems thinking in equal measure.",
      ctaLabel: "View openings",
      target: "roles",
      icon: "sparkle",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      alt: "Designer working late at night"
    },
    {
      id: "growth",
      title: "Growth",
      desc: "Own the channels, the numbers, and the story behind how SharkStack finds its next great client.",
      ctaLabel: "View openings",
      target: "roles",
      icon: "chart",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
      alt: "Team reviewing growth strategy"
    },
    {
      id: "ai-training",
      title: "AI Training",
      desc: "Teach teams to build and ship with AI — workshops, tooling, and hands-on training that actually sticks.",
      ctaLabel: "View openings",
      target: "roles",
      icon: "book",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      alt: "Team in an AI training workshop"
    }
  ]
};

export const workBenefitsCardsContent = {
  heading: "Perks that actually matter.",
  cards: [
    {
      id: "pto",
      title: "Flexible time off",
      desc: "Unlimited PTO with a mandatory minimum, because rested Sharks build better.",
      icon: "calendar",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop"
    },
    {
      id: "ai-training",
      title: "AI trainings",
      desc: "Regular hands-on AI and tooling workshops to keep your skills sharp — on company time.",
      icon: "sparkle",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop"
    },
    {
      id: "equity",
      title: "Equity for everyone",
      desc: "Every full-time Shark gets equity. When we win, you win — literally.",
      icon: "chart",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=900&auto=format&fit=crop"
    },
    {
      id: "mentorship",
      title: "Excellent mentorship",
      desc: "Senior engineers who actually review your code and help you level up, every sprint.",
      icon: "book",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&auto=format&fit=crop"
    },
    {
      id: "retreats",
      title: "Team retreats",
      desc: "We fly the whole crew somewhere new once a year to build, eat, and unwind together.",
      icon: "users",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=900&auto=format&fit=crop"
    },
    {
      id: "activities",
      title: "Team activities",
      desc: "Regular hackathons, game nights, and off-sites to build and unwind together.",
      icon: "users",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=900&auto=format&fit=crop"
    }
  ]
};

export const whySharkScrollContent = {
  words: ["Why", "SharkStack"],
  cards: [
    {
      title: "Craft & Ownership",
      icon: "sunburst",
      items: ["Ship end-to-end", "No bloated process", "Real client impact", "Craft over process"]
    },
    {
      title: "Remote, For Real",
      icon: "orbit",
      items: ["Work from anywhere", "Async by default", "Output over hours", "Flexible time off"]
    },
    {
      title: "Grow On Purpose",
      icon: "lattice",
      items: ["Learning budget", "Senior mentorship", "Room to stretch", "Equity for everyone"]
    }
  ]
};

export const hiringProcessContent = {
  heading: "How you become a Shark.",
  sub: "Five steps, no black box. Most candidates hear back within a week at every stage.",
  ctaLabel: "View Open Roles",
  steps: [
    { title: "Apply", desc: "Send your resume and a note on why you want in. We read every single one.", tag: "WE READ EVERY SINGLE ONE." },
    { title: "Intro call", desc: "A relaxed 30-minute chat with our talent lead about you, us, and the role.", tag: "NO SCRIPTS. JUST CONVERSATION." },
    {
      title: "Skills conversation",
      desc: "A deep-dive with the hiring team on your craft — real work, real problems, no gotchas.",
      tag: "REAL WORK. REAL TALK."
    },
    { title: "Meet the team", desc: "Talk with the people you'd actually work with day to day.", tag: "THE PEOPLE YOU'LL ACTUALLY WORK WITH." },
    { title: "Offer", desc: "If it's a match on both sides, we move fast — offers typically go out within 48 hours.", tag: "WE MOVE FAST, NOT RECKLESS." }
  ]
};

export const openRolesContent = {
  heading: "We're hiring.",
  sub: "Search or filter to find where you fit.",
  searchPlaceholder: "Search roles or departments…",
  emptyState: "No roles match that search — but we're always open to meeting people who love building great products. Drop us a line anyway.",
  noOpeningsState: "We aren't hiring right now — but we're always excited to meet great people. Check back soon, or reach out anyway.",
  searchValidationError: "Search can only contain letters, numbers, and spaces."
};

export const employeeReviewsContent = {
  heading: "Straight from the crew.",
  reviews: [
    {
      id: 1,
      quote: "I own my roadmap here in a way I never did at a bigger shop. Ideas ship in days, not sprints.",
      author: "Jordan Blake",
      role: "Senior Engineer",
      department: "Engineering"
    },
    {
      id: 2,
      quote: "The craft bar is the highest I've worked at. Every review makes the work sharper, not just 'shipped'.",
      author: "Maya Ferreira",
      role: "Product Designer",
      department: "Design"
    },
    {
      id: 3,
      quote: "Remote-first actually means something here. I've never felt more trusted to just do good work.",
      author: "Theo Nakamura",
      role: "DevOps Engineer",
      department: "Engineering"
    },
    {
      id: 4,
      quote: "Leadership is transparent about numbers, misses, and wins. It makes the wins feel earned.",
      author: "Priya Shah",
      role: "Growth Lead",
      department: "Growth"
    },
    {
      id: 5,
      quote: "I've grown more in a year at SharkStack than in three years anywhere else. The mentorship is real.",
      author: "Elliot Cross",
      role: "Frontend Engineer",
      department: "Engineering"
    }
  ]
};

export const applyContent = {
  heading: "Don't see your role? Swim up anyway.",
  subtext: "We're always looking for people who move fast, think sharp, and build things that matter. Send us your resume and tell us where you'd fit.",
  email: supportEmail
};
