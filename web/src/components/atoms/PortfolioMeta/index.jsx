import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";
import { portfolioPageContent } from "@/content/portfolio";

export function PortfolioMetaLeft({ project, index = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <p
        style={{
          ...fonts.montSemiBold,
          fontSize: sizes.xs,
          letterSpacing: "0.2em",
          color: colors.primary,
          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          margin: 0,
          flexShrink: 0
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </p>
      <h2
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(1rem, 3.5vw, 2.4rem)",
          color: colors.white,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)"
        }}
      >
        {project.name}
      </h2>
    </div>
  );
}

export function PortfolioMetaRight() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
      <p
        style={{
          ...fonts.montMedium,
          fontSize: sizes.xs,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: colors.white,
          margin: 0
        }}
      >
        {portfolioPageContent.cta}
      </p>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.9, flexShrink: 0 }}>
        <path d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
