import { useState } from "react";
import { ArrowRight } from "@/assets/svgs";
import Spinner from "@/components/atoms/Spinner";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const SIZES = {
  lg: { gap: "2rem", padding: "0.5rem 0.5rem 0.5rem 2.5rem", iconSize: 60, fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", arrowSize: 22 },
  md: { gap: "1.5rem", padding: "0.4rem 0.4rem 0.4rem 2rem", iconSize: 48, fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)", arrowSize: 16 },
  sm: { gap: "1rem", padding: "0.3rem 0.3rem 0.3rem 1.4rem", iconSize: 36, fontSize: "0.8rem", arrowSize: 14 }
};

export default function Button({ children, icon = true, type = "button", size = "md", onClick, disabled = false, loading = false, style }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { gap, padding, iconSize, fontSize, arrowSize } = SIZES[size];
  const isDisabled = disabled || loading;

  const bg = isDisabled ? colors.textPrimary : pressed ? `color-mix(in srgb, ${colors.primary} 82%, black)` : hovered ? colors.primary : colors.textPrimary;

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap,
        cursor: isDisabled ? "not-allowed" : "pointer",
        border: "none",
        borderRadius: "9999px",
        backgroundColor: bg,
        padding,
        opacity: isDisabled ? 0.6 : 1,
        transform: pressed && !isDisabled ? "scale(0.97) translateY(0)" : hovered && !isDisabled ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered && !isDisabled ? `0 10px 24px -8px ${colors.primary}70` : "0 0 0 rgba(0,0,0,0)",
        transition: "background-color 0.15s ease, transform 0.15s ease, box-shadow 0.25s ease",
        ...style
      }}
    >
      <span
        style={{
          ...fonts.montBold,
          fontSize,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.white,
          whiteSpace: "nowrap"
        }}
      >
        {children}
      </span>

      {icon && (
        <span
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            backgroundColor: colors.white,
            color: colors.textPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transform: hovered && !isDisabled ? "translateX(3px)" : "translateX(0)",
            transition: "transform 0.25s ease"
          }}
        >
          {loading ? <Spinner size={arrowSize + 4} color={colors.textPrimary} thickness={2} /> : icon === true ? <ArrowRight size={arrowSize} /> : icon}
        </span>
      )}
    </button>
  );
}
