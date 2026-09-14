import { supportEmail } from "./site";

export const pricingContent = {
  label: "Pricing",
  heading: "Packages built around your product.",
  subheading: "Pick a service to see its packages, or build a custom scope — every engagement starts with a discovery call to confirm final pricing.",
  ctaLabel: "Request this package",
  disclaimer: "This is a rough estimate to start the conversation. Final pricing is confirmed after a discovery call.",
  note: `Have a project in mind that doesn't fit neatly into a package? Email us at ${supportEmail} and we'll scope it with you.`
};

export const gigServices = [
  {
    id: "web-app-dev",
    name: "Web & App Dev",
    icon: "laptop",
    tagline: "Websites, web apps, and mobile apps built to ship.",
    basePrice: 2500,
    packages: [
      {
        name: "Basic",
        tagline: "A landing page or simple single-flow app.",
        price: "$2,500",
        period: "starting price",
        delivery: "2 weeks",
        revisions: "2 revisions",
        features: ["Single page or simple app flow", "Responsive, mobile-first layout", "Basic on-page SEO setup", "2 rounds of revisions"]
      },
      {
        name: "Standard",
        tagline: "A full web or mobile app with real functionality.",
        price: "$8,000",
        period: "starting price",
        delivery: "5 weeks",
        revisions: "3 revisions",
        highlight: true,
        features: ["Multi-page web or mobile app", "Custom UI components", "CMS or admin panel", "Third-party API integrations", "3 rounds of revisions"]
      },
      {
        name: "Premium",
        tagline: "A multi-platform product built to scale.",
        price: "$18,000",
        period: "starting price",
        delivery: "8 weeks",
        revisions: "Unlimited revisions",
        features: [
          "Web + iOS + Android from one codebase",
          "Advanced state management",
          "Deep third-party integrations",
          "Performance optimization & load testing",
          "Unlimited revisions during build"
        ]
      }
    ],
    customCategories: [
      {
        name: "Core features",
        features: [
          { id: "web", label: "Web application", price: 3000 },
          { id: "mobile", label: "Mobile app (iOS & Android)", price: 5000 },
          { id: "admin", label: "Admin dashboard", price: 2200 }
        ]
      },
      {
        name: "Add-ons",
        features: [
          { id: "payments", label: "Payment processing", price: 1800 },
          { id: "support", label: "90 days of post-launch support", price: 1200 }
        ]
      }
    ],
    compareRows: [
      { label: "Scope", values: ["Single page / app flow", "Multi-page app", "Web + iOS + Android"] },
      { label: "Custom UI components", values: [false, true, true] },
      { label: "CMS or admin panel", values: [false, true, true] },
      { label: "Third-party integrations", values: [false, true, true] },
      { label: "Performance optimization & load testing", values: [false, false, true] },
      { label: "Delivery", values: ["2 weeks", "5 weeks", "8 weeks"] },
      { label: "Revisions", values: ["2", "3", "Unlimited"] }
    ]
  },
  {
    id: "backend-apis",
    name: "Backend & APIs",
    icon: "lattice",
    tagline: "Custom backend architecture, databases, and integrations.",
    basePrice: 2000,
    packages: [
      {
        name: "Basic",
        tagline: "A single API service or integration.",
        price: "$2,000",
        period: "starting price",
        delivery: "1.5 weeks",
        revisions: "2 revisions",
        features: ["Single API service", "Database schema setup", "Basic authentication", "2 rounds of revisions"]
      },
      {
        name: "Standard",
        tagline: "A custom backend built for your product.",
        price: "$6,500",
        period: "starting price",
        delivery: "4 weeks",
        revisions: "3 revisions",
        highlight: true,
        features: [
          "Custom backend architecture",
          "Relational or document database design",
          "Third-party API integrations",
          "Role-based access control",
          "3 rounds of revisions"
        ]
      },
      {
        name: "Premium",
        tagline: "A scalable, multi-service backend system.",
        price: "$15,000",
        period: "starting price",
        delivery: "7 weeks",
        revisions: "Unlimited revisions",
        features: [
          "Microservice architecture",
          "Horizontal scaling & caching layer",
          "Event-driven pipelines",
          "Observability & alerting",
          "Unlimited revisions during build"
        ]
      }
    ],
    customCategories: [
      {
        name: "Core features",
        features: [
          { id: "backend", label: "Custom backend architecture", price: 3500 },
          { id: "database", label: "Database design & setup", price: 1500 },
          { id: "integrations", label: "Third-party API integrations", price: 2000 }
        ]
      },
      {
        name: "Add-ons",
        features: [
          { id: "payments", label: "Payment processing", price: 1800 },
          { id: "support", label: "90 days of post-launch support", price: 1200 }
        ]
      }
    ],
    compareRows: [
      { label: "Scope", values: ["Single API service", "Custom backend architecture", "Microservice architecture"] },
      { label: "Access control", values: ["Basic auth", "Role-based access control", "Role-based + SSO"] },
      { label: "Third-party integrations", values: [false, true, true] },
      { label: "Scaling & caching layer", values: [false, false, true] },
      { label: "Observability & alerting", values: [false, false, true] },
      { label: "Delivery", values: ["1.5 weeks", "4 weeks", "7 weeks"] },
      { label: "Revisions", values: ["2", "3", "Unlimited"] }
    ]
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: "orbit",
    tagline: "Interfaces and design systems your users will love.",
    basePrice: 1200,
    packages: [
      {
        name: "Basic",
        tagline: "A style guide and key screens.",
        price: "$1,500",
        period: "starting price",
        delivery: "1 week",
        revisions: "2 revisions",
        features: ["Up to 5 key screens", "Style guide (color, type, spacing)", "Mobile & desktop layouts", "2 rounds of revisions"]
      },
      {
        name: "Standard",
        tagline: "A complete product design, end to end.",
        price: "$4,500",
        period: "starting price",
        delivery: "3 weeks",
        revisions: "3 revisions",
        highlight: true,
        features: ["Full product UI design", "Interactive prototype", "Component library", "Usability testing round", "3 rounds of revisions"]
      },
      {
        name: "Premium",
        tagline: "A full design system with brand guidelines.",
        price: "$9,000",
        period: "starting price",
        delivery: "5 weeks",
        revisions: "Unlimited revisions",
        features: [
          "End-to-end design system",
          "Brand guidelines & documentation",
          "Motion & interaction design",
          "Design QA through development",
          "Unlimited revisions during build"
        ]
      }
    ],
    customCategories: [
      {
        name: "Core features",
        features: [
          { id: "uiux", label: "Custom UI/UX design", price: 2000 },
          { id: "design-system", label: "Design system & brand guide", price: 1200 },
          { id: "usability", label: "Usability testing & iteration", price: 900 }
        ]
      },
      {
        name: "Add-ons",
        features: [{ id: "support", label: "90 days of post-launch support", price: 1200 }]
      }
    ],
    compareRows: [
      { label: "Scope", values: ["Up to 5 screens", "Full product design", "Full design system"] },
      { label: "Interactive prototype", values: [false, true, true] },
      { label: "Component library", values: [false, true, true] },
      { label: "Usability testing", values: [false, true, true] },
      { label: "Brand guidelines & motion design", values: [false, false, true] },
      { label: "Delivery", values: ["1 week", "3 weeks", "5 weeks"] },
      { label: "Revisions", values: ["2", "3", "Unlimited"] }
    ]
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    icon: "sparkle",
    tagline: "AI features, chatbots, and workflow automation.",
    basePrice: 2000,
    packages: [
      {
        name: "Basic",
        tagline: "A single automated workflow.",
        price: "$2,000",
        period: "starting price",
        delivery: "1 week",
        revisions: "2 revisions",
        features: ["One automated workflow", "Off-the-shelf model integration", "Basic monitoring", "2 rounds of revisions"]
      },
      {
        name: "Standard",
        tagline: "AI features integrated into your product.",
        price: "$6,000",
        period: "starting price",
        delivery: "4 weeks",
        revisions: "3 revisions",
        highlight: true,
        features: [
          "Custom AI feature integration",
          "AI chatbot or virtual agent",
          "Prompt engineering & evaluation",
          "Usage analytics dashboard",
          "3 rounds of revisions"
        ]
      },
      {
        name: "Premium",
        tagline: "A custom AI pipeline with autonomous agents.",
        price: "$14,000",
        period: "starting price",
        delivery: "7 weeks",
        revisions: "Unlimited revisions",
        features: [
          "Custom AI/agent pipeline",
          "Multi-step automation & orchestration",
          "Data pipeline & analytics",
          "Guardrails, evals & monitoring",
          "Unlimited revisions during build"
        ]
      }
    ],
    customCategories: [
      {
        name: "Core features",
        features: [
          { id: "ai", label: "AI / automation features", price: 4000 },
          { id: "chatbot", label: "AI chatbot or virtual agent", price: 2500 },
          { id: "data-pipeline", label: "Data pipeline & analytics", price: 2200 }
        ]
      },
      {
        name: "Add-ons",
        features: [{ id: "support", label: "90 days of post-launch support", price: 1200 }]
      }
    ],
    compareRows: [
      { label: "Scope", values: ["One automated workflow", "Custom AI feature integration", "Custom AI/agent pipeline"] },
      { label: "Chatbot or virtual agent", values: [false, true, true] },
      { label: "Prompt engineering & evaluation", values: [false, true, true] },
      { label: "Data pipeline & analytics", values: [false, false, true] },
      { label: "Guardrails & monitoring", values: [false, false, true] },
      { label: "Delivery", values: ["1 week", "4 weeks", "7 weeks"] },
      { label: "Revisions", values: ["2", "3", "Unlimited"] }
    ]
  }
];
