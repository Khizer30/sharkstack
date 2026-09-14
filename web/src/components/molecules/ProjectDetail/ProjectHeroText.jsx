import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ProjectHeroText({ project, isMobile, descRef, mobileTextY, heroTextY, heroTextOpacity, heroTextScale, heroTextFilter }) {
  return (
    <motion.div
      ref={descRef}
      style={{
        position: "absolute",
        ...(isMobile
          ? {
              top: "clamp(8rem, 22vh, 12rem)",
              left: "1.4rem",
              right: "1.4rem",
              maxWidth: "100%",
              transformOrigin: "top left"
            }
          : {
              bottom: "clamp(16rem, 36vh, 24rem)",
              left: "clamp(1.5rem, 2.5vw, 2.5rem)",
              maxWidth: "44vw",
              transformOrigin: "bottom left"
            }),
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        y: isMobile ? mobileTextY : heroTextY,
        opacity: isMobile ? 1 : heroTextOpacity,
        scale: isMobile ? 1 : heroTextScale,
        filter: isMobile ? "blur(0px)" : heroTextFilter,
        zIndex: 20
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start" }}
      >
        <div
          style={{
            width: "2px",
            flexShrink: 0,
            alignSelf: "stretch",
            background: `linear-gradient(to bottom, ${colors.primary}80, ${colors.primary}10)`,
            borderRadius: "2px",
            marginTop: "0.2rem"
          }}
        />
        <p
          style={{
            ...fonts.poppinsMedium,
            fontSize: isMobile ? "clamp(0.9rem, 3.8vw, 1.15rem)" : "clamp(0.85rem, 1.2vw, 1.1rem)",
            lineHeight: 1.75,
            color: colors.textSecondary,
            margin: 0,
            letterSpacing: "-0.01em"
          }}
        >
          {project.description}
        </p>
      </motion.div>

      {project.url && (
        <motion.a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            alignSelf: "flex-start",
            padding: "0.55rem 1.1rem",
            border: `1px solid ${colors.black}18`,
            borderRadius: "100px",
            background: colors.black,
            color: colors.white,
            ...fonts.montMedium,
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.2s ease, border-color 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary;
            e.currentTarget.style.borderColor = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.black;
            e.currentTarget.style.borderColor = `${colors.black}18`;
          }}
        >
          Visit Project
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      )}
    </motion.div>
  );
}
