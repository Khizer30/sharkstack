import { supportEmail } from "./site";

export const footerContent = {
  tickerItems: ["Design + Development", "✦", "Scalable Products", "✦", "Fast Delivery", "✦", "Full Stack Agency", "✦", "SharkStack", "✦"],
  links: [
    { label: supportEmail, href: `mailto:${supportEmail}` },
    { label: "+92 331 1144446", href: "tel:+923311144446" },
    { label: "Instagram", href: "https://www.instagram.com/shark.stack/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/sharkstackss" }
  ],
  address: "House 12, Street 2, Opposite The Insight School, Bukhari Colony, Jinnah Road, Multan",
  copyright: `© ${new Date().getFullYear()} SharkStack. All rights reserved.`,
  legalLinks: [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refunds", href: "/refunds" }
  ]
};
