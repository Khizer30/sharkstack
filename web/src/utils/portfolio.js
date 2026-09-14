import { colors } from "@/constants/colors";

const BG_CYCLE = [
  colors.bgDark,
  colors.bgBrand,
  colors.statsPanel1,
  colors.statsPanel2,
  colors.statsPanel3,
  colors.statsPanel4,
  colors.pyramidBg1,
  colors.pyramidBg2,
  colors.bgCardDeep,
  colors.termChromeEnd
];

export function normalizePortfolio(portfolio, index = 0) {
  return {
    id: portfolio.id,
    name: portfolio.title,
    category: portfolio.technologies?.[0] ?? "Product",
    year: String(new Date().getFullYear()),
    bg: BG_CYCLE[index % BG_CYCLE.length],
    image: portfolio.media?.[0],
    video: undefined,
    url: portfolio.link || "",
    description: portfolio.description,
    problemSolution: portfolio.problemAndSolution,
    technologies: portfolio.technologies ?? [],
    tools: portfolio.tools ?? []
  };
}
