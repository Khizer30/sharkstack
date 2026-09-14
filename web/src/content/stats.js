import { colors } from "@/constants/colors";

export const statsContent = {
  label: "By The Numbers",
  heading: ["Numbers", "Don't Lie."],
  sub: "Every project starts with a conversation."
};

export const funnelStages = [
  {
    label: "Site Visitors",
    icon: "search",
    value: 4100,
    displayValue: "4,100",
    gradient: [
      { offset: "0%", color: colors.primary },
      { offset: "100%", color: colors.chart2 }
    ],
    panelBg: colors.statsPanel1,
    accent: colors.primary,
    sub: "Monthly unique visitors to sharkstack.dev",
    trend: "+18% MoM",
    desc: "Founders and engineering teams discovering our work every month."
  },
  {
    label: "Project Inquiries",
    icon: "chart",
    value: 2957,
    displayValue: "2,957",
    gradient: [
      { offset: "0%", color: colors.chart2 },
      { offset: "100%", color: colors.chart3 }
    ],
    panelBg: colors.statsPanel2,
    accent: colors.white,
    sub: "New project inquiries received",
    trend: "+24% YoY",
    desc: "Teams reaching out to build products, platforms, and AI features with us."
  },
  {
    label: "Discovery Calls",
    icon: "users",
    value: 1084,
    displayValue: "1,084",
    gradient: [
      { offset: "0%", color: colors.chart3 },
      { offset: "100%", color: colors.chart4 }
    ],
    panelBg: colors.statsPanel3,
    accent: colors.primary,
    sub: "Technical scoping calls completed",
    trend: "72% close rate",
    desc: "Where we map the stack, timeline, and scope before writing a line of code."
  },
  {
    label: "Proposals Sent",
    icon: "check",
    value: 380,
    displayValue: "380",
    gradient: [
      { offset: "0%", color: colors.chart4 },
      { offset: "100%", color: colors.chart5 }
    ],
    panelBg: colors.statsPanel4,
    accent: colors.white,
    sub: "Proposals sent to clients",
    trend: "94% on time",
    desc: "Technical scopes covering architecture, AI integration, and delivery plan."
  },
  {
    label: "Projects Shipped",
    icon: "laptop",
    value: 320,
    displayValue: "320",
    gradient: [
      { offset: "0%", color: colors.chart5 },
      { offset: "100%", color: colors.primary }
    ],
    sub: "Production systems delivered",
    trend: "100% shipped",
    desc: "Web apps, APIs, and AI-powered products running in production today."
  }
];
