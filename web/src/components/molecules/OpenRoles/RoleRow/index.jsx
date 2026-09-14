import { useState } from "react";
import { ArrowUpRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { usePageTransition } from "@/context/PageTransition";

export default function RoleRow({ role }) {
  const [hovered, setHovered] = useState(false);
  const { transitionTo } = usePageTransition();

  return (
    <button
      type="button"
      onClick={() => transitionTo(`/careers/${role.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-between w-full text-left cursor-pointer"
      style={{
        ...fonts.montRegular,
        borderTop: `1px solid ${colors.borderLight}`,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        padding: "clamp(1.1rem, 2vw, 1.5rem) 0",
        background: "none",
        transition: "padding-left 0.25s ease",
        paddingLeft: hovered ? "0.5rem" : 0
      }}
    >
      <div>
        <span
          style={{
            ...fonts.poppinsSemiBold,
            color: hovered ? colors.primary : colors.textPrimary,
            fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
            transition: "color 0.25s"
          }}
        >
          {role.title}
        </span>
        <div style={{ ...fonts.montRegular, color: colors.textMuted, fontSize: "0.85rem", marginTop: "0.35rem" }}>
          {role.department} • {role.location} • {role.type}
        </div>
      </div>

      <span
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: "2.5rem",
          height: "2.5rem",
          border: `1px solid ${hovered ? colors.primary : colors.borderMedium}`,
          color: hovered ? colors.primary : colors.textMuted,
          transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s, border-color 0.25s, color 0.25s"
        }}
      >
        <ArrowUpRight size={16} />
      </span>
    </button>
  );
}
