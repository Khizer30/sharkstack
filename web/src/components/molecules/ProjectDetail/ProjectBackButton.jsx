import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ProjectBackButton({ isMobile, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "1.1rem 1.4rem" : "1.6rem 2.5rem",
        pointerEvents: "none"
      }}
    >
      <button
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: `${colors.black}40`,
          ...fonts.montMedium,
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: 0,
          pointerEvents: "auto",
          transition: "color 0.2s ease",
          marginLeft: isMobile ? undefined : "auto"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = `${colors.black}90`)}
        onMouseLeave={(e) => (e.currentTarget.style.color = `${colors.black}40`)}
      >
        ← {isMobile ? "Back" : "Portfolio"}
      </button>
    </motion.div>
  );
}
