import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ProjectHeroMedia({ project, isMobile, heroImageOpacity }) {
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "3rem",
          right: "1.4rem",
          opacity: heroImageOpacity,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            ...fonts.montMedium,
            fontSize: "0.55rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: `${colors.black}40`
          }}
        >
          [ Scroll ]
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "32vh",
        borderRadius: 0,
        overflow: "hidden",
        opacity: heroImageOpacity,
        zIndex: 8
      }}
    >
      <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </motion.div>
  );
}
