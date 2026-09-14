import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const EASE = [0.16, 1, 0.3, 1];

export default function IntroCard({ content, width, isActive, onMouseEnter, onViewAllClick }) {
  return (
    <motion.div
      animate={{ width }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={onMouseEnter}
      className="relative shrink-0 self-start overflow-hidden rounded-[4px]"
      style={{ background: colors.black, border: `1px solid ${colors.white}14`, aspectRatio: "3 / 4" }}
    >
      <div className="relative h-full flex flex-col p-8">
        <div className="flex-1" style={{ minHeight: "55%" }}>
          <h3
            style={{
              ...fonts.poppinsBold,
              color: colors.white,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              fontSize: isActive ? "clamp(1.4rem, 1.9vw, 1.85rem)" : "1rem",
              transition: "font-size 0.4s ease"
            }}
          >
            {content.heading}
          </h3>
          <p
            style={{
              ...fonts.montRegular,
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: `${colors.white}90`,
              marginTop: "1rem",
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.4s ease"
            }}
          >
            {content.description}
          </p>
        </div>

        <div
          className="relative rounded-[4px] overflow-hidden cursor-pointer"
          style={{ height: "40%", background: `${colors.white}0D` }}
          onClick={onViewAllClick}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
            <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem", color: colors.white }}>{content.viewAllLabel}</span>
            <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: colors.primary }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
