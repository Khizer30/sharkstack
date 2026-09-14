import MagneticButton from "@/components/atoms/MagneticButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const BASE = {
  ...fonts.montMedium,
  fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
  borderRadius: "9999px",
  padding: "0.85rem 1.75rem",
  textDecoration: "none",
  letterSpacing: "0.03em",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "border-color 0.25s, color 0.25s"
};

export default function OutlinePill({ href, onClick, muted = false, children, style }) {
  const color = muted ? `${colors.cream}50` : colors.cream;
  const border = muted ? `${colors.cream}15` : `${colors.cream}30`;
  const hoverColor = muted ? colors.cream : colors.primary;
  const hoverBorder = muted ? `${colors.cream}40` : colors.primary;

  return (
    <MagneticButton
      as={href ? "a" : "button"}
      href={href}
      onClick={onClick}
      style={{ ...BASE, color, border: `1px solid ${border}`, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = border;
      }}
    >
      {children}
    </MagneticButton>
  );
}
