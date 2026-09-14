import { useState } from "react";
import { ArrowUpRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { scrollToId } from "@/utils/helpers";

export default function HeroLink({ label, target }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      data-magnetic
      data-magnetic-color={colors.primary}
      onClick={() => scrollToId(target)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center cursor-pointer"
      style={{
        ...fonts.montMedium,
        fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
        color: colors.white,
        background: "none",
        border: "none",
        padding: 0,
        gap: "0.5rem",
        paddingBottom: "0.15rem",
        transition: "color 0.25s"
      }}
    >
      {label}
      <span
        className="inline-flex"
        style={{
          transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <ArrowUpRight size={16} />
      </span>

      <span className="absolute left-0 bottom-0 w-full" style={{ height: "1px", background: `${colors.white}30`, overflow: "hidden" }}>
        <span
          className="absolute inset-0"
          style={{
            background: colors.primary,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </span>
    </button>
  );
}
