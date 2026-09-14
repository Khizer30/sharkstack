import { supportEmail } from "./site";

export const termsContent = {
  label: "Legal",
  heading: "Terms of Service",
  updated: "Effective July 6, 2026",
  intro:
    'These Terms of Service ("Terms") govern any use of the SharkStack website and any services, proposals, or agreements entered into with SharkStack ("we", "us", "our"). By engaging our services or using this site, you agree to these Terms.',
  sections: [
    {
      heading: "1. Services",
      paragraphs: [
        'SharkStack provides custom software design and development services, including web and mobile applications, backend systems, AI integrations, and related consulting. The specific scope, deliverables, timeline, and fees for any engagement are defined in a separate project proposal or statement of work ("SOW") agreed upon by both parties.',
        "Any package or pricing shown on this website is illustrative and subject to change until confirmed in a signed SOW."
      ]
    },
    {
      heading: "2. Payment Terms",
      paragraphs: [
        "Unless otherwise agreed in writing, projects are invoiced according to the milestone schedule set out in the SOW. Invoices are due within 14 days of receipt. Late payments may result in a pause of ongoing work until the account is brought current."
      ]
    },
    {
      heading: "3. Intellectual Property",
      paragraphs: [
        "Upon full and final payment for a project, ownership of the final, delivered work product transfers to the client, excluding any third-party libraries, frameworks, or SharkStack-owned tooling used to build it, which remain licensed for use within the delivered product.",
        "SharkStack retains the right to showcase completed work in its portfolio and marketing materials unless the client requests confidentiality in writing."
      ]
    },
    {
      heading: "4. Client Responsibilities",
      paragraphs: [
        "Clients are responsible for providing timely feedback, access, credentials, and content required to complete a project. Delays caused by missing client input may extend project timelines accordingly."
      ]
    },
    {
      heading: "5. Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by law, SharkStack's total liability for any claim arising from our services is limited to the amount paid by the client for the specific engagement giving rise to the claim. SharkStack is not liable for indirect, incidental, or consequential damages."
      ]
    },
    {
      heading: "6. Termination",
      paragraphs: [
        "Either party may terminate an active engagement with written notice as outlined in the SOW. The client remains responsible for payment of all work completed up to the termination date."
      ]
    },
    {
      heading: "7. Governing Law",
      paragraphs: [
        "These Terms are governed by the laws of the jurisdiction in which SharkStack is registered to do business, without regard to conflict-of-law principles."
      ]
    },
    {
      heading: "8. Contact",
      paragraphs: [`Questions about these Terms can be sent to ${supportEmail}.`]
    }
  ]
};

export const privacyContent = {
  label: "Legal",
  heading: "Privacy Policy",
  updated: "Effective July 6, 2026",
  intro:
    'This Privacy Policy explains how SharkStack ("we", "us", "our") collects, uses, and protects information when you visit this website or engage our services.',
  sections: [
    {
      heading: "1. Information We Collect",
      bullets: [
        "Contact details you submit through our forms, such as name, email address, and project details.",
        "Usage data collected automatically, such as pages visited, device and browser type, and referral source.",
        "Cookies and similar technologies used for essential site functionality and analytics."
      ]
    },
    {
      heading: "2. How We Use Information",
      paragraphs: [
        "We use the information we collect to respond to inquiries, scope and deliver projects, send project-related communications, and improve this website."
      ]
    },
    {
      heading: "3. Sharing of Information",
      paragraphs: [
        "We do not sell personal data. We may share information with service providers who help us operate the site or deliver services (such as hosting, analytics, and payment processing), and when required by law."
      ]
    },
    {
      heading: "4. Data Retention",
      paragraphs: ["We retain personal information only as long as necessary for the purposes described in this policy, or as required by law."]
    },
    {
      heading: "5. Your Rights",
      paragraphs: [
        `Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, contact us at ${supportEmail}.`
      ]
    },
    {
      heading: "6. Security",
      paragraphs: ["We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is 100% secure."]
    },
    {
      heading: "7. Changes to This Policy",
      paragraphs: ["We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date."]
    },
    {
      heading: "8. Contact",
      paragraphs: [`Questions about this Privacy Policy can be sent to ${supportEmail}.`]
    }
  ]
};

export const refundContent = {
  label: "Legal",
  heading: "Refund Policy",
  updated: "Effective July 6, 2026",
  intro: "This Refund Policy applies to custom development engagements and packaged services purchased through SharkStack.",
  sections: [
    {
      heading: "1. Project-Based Work",
      paragraphs: ["Because each engagement is custom-scoped, refunds are evaluated on a milestone basis rather than a blanket refund window."]
    },
    {
      heading: "2. Before Work Begins",
      paragraphs: [
        "If a client cancels within 3 business days of the initial deposit and before any work has started, the deposit is fully refundable, minus any payment processing fees already incurred."
      ]
    },
    {
      heading: "3. After Work Begins",
      paragraphs: [
        "Once development has started, payments for completed milestones are non-refundable, as they reflect work already delivered. Payments made for milestones not yet started may be refunded at SharkStack's discretion."
      ]
    },
    {
      heading: "4. Retainers & Ongoing Support",
      paragraphs: ["Unused hours in a monthly retainer do not roll over and are non-refundable at the end of the billing cycle."]
    },
    {
      heading: "5. How to Request a Refund",
      paragraphs: [`To request a refund, contact ${supportEmail} with your project name and the reason for the request.`]
    },
    {
      heading: "6. Processing Time",
      paragraphs: ["Approved refunds are processed within 10 business days to the original payment method."]
    }
  ]
};
