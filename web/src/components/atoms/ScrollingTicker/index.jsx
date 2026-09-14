import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ScrollingTicker({ items, speed = 40 }) {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        borderTop: `1px solid ${colors.cream}12`,
        borderBottom: `1px solid ${colors.cream}12`,
        backgroundColor: `${colors.black}99`,
        backdropFilter: "blur(12px)",
        padding: "0.9rem 0",
        transform: "rotate(-1.5deg) scaleX(1.1)"
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `footer-marquee ${speed}s linear infinite`
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              ...fonts.montSemiBold,
              fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: item === "✦" ? colors.primary : `${colors.cream}60`,
              padding: "0 1.5rem",
              whiteSpace: "nowrap"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
