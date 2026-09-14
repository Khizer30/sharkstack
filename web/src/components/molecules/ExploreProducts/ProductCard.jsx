import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const EASE = [0.16, 1, 0.3, 1];

export default function ProductCard({ project, index, width, isActive, onMouseEnter, onClick }) {
  return (
    <motion.div
      animate={{ width }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="relative shrink-0 self-start overflow-hidden rounded-[4px] cursor-pointer"
      style={{ background: project.bg, aspectRatio: "3 / 4" }}
    >
      <div
        className="absolute pointer-events-none z-20"
        style={{
          top: "-1.75rem",
          left: 0,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease"
        }}
      >
        <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem", color: colors.white }}>{String(index).padStart(2, "0")}</span>
      </div>

      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: isActive ? "brightness(1)" : "brightness(0.7)", transition: "filter 0.5s ease" }}
      />

      <div className="absolute inset-0 pointer-events-none flex flex-col p-4">
        <div
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease"
          }}
        >
          <p
            className="w-fit rounded-[3px] backdrop-blur-lg"
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              color: colors.white,
              background: `${colors.black}66`,
              padding: "0.4rem 0.65rem"
            }}
          >
            {project.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
