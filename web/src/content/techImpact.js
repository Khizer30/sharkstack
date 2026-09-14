import techImpactBg from "@/assets/images/tech-impact-bg.webp";

export const techImpactContent = {
  label: "Built To Scale",
  heading: "Impact at a glance.",
  sub: "Real numbers from the systems we've shipped — not vanity metrics.",
  backgroundImage: techImpactBg,
  backgroundAlt: "Code on a dark monitor",
  headline: {
    label: "Total Impact Delivered",
    value: 42750,
    suffix: "+",
    change: "+186%",
    trendUp: true,
    series: [2, 3, 4, 4, 5, 6, 8, 10, 14, 20, 30, 48, 72, 100]
  },
  metrics: [
    { label: "Uptime SLA", change: "+0.4%", trendUp: true, value: 99.98, decimals: 2, suffix: "%", prevLabel: "99.6% previous period" },
    { label: "Avg Response Time", change: "-35%", trendUp: false, value: 82, suffix: "ms", prevLabel: "126ms previous period" },
    { label: "Active Integrations", change: "+28%", trendUp: true, value: 128, suffix: "+", prevLabel: "100 previous period" },
    { label: "Projects Delivered", change: "+24%", trendUp: true, value: 165, suffix: "+", prevLabel: "133 previous period" },
    { label: "Clients Served", change: "+20%", trendUp: true, value: 80, suffix: "+", prevLabel: "66 previous period" },
    { label: "Automation Hours Saved", change: "+32%", trendUp: true, value: 10000, suffix: "+", prevLabel: "7.5K previous period" },
    { label: "Client Satisfaction", change: "+2%", trendUp: true, value: 98, suffix: "%", prevLabel: "96% previous period" },
    { label: "Countries Served", change: "+3", trendUp: true, value: 12, suffix: "+", prevLabel: "9 previous period" },
    { label: "AI Solutions Delivered", change: "+148%", trendUp: true, value: 165, suffix: "+", prevLabel: "66 previous period" },
    { label: "Manual Hours Automated", change: "+240%", trendUp: true, value: 10000, suffix: "+", prevLabel: "2.9K previous period" },
    { label: "Client Cost Savings", change: "+185%", trendUp: true, value: 500, prefix: "$", suffix: "K+", prevLabel: "$175K previous period" },
    { label: "Production Accuracy", change: "+0.15%", trendUp: true, value: 99.95, decimals: 2, suffix: "%", prevLabel: "99.8% previous period" }
  ]
};
