import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function FooterWordmark({ innerRef }) {
  return (
    <div
      ref={innerRef}
      style={{
        position: "absolute",
        bottom: "-2vh",
        left: "50%",
        transform: "translateX(-50%)",
        ...fonts.poppinsBold,
        fontSize: "17vw",
        lineHeight: 0.75,
        letterSpacing: "-0.05em",
        whiteSpace: "nowrap",
        color: "transparent",
        WebkitTextStroke: `1px ${colors.cream}0A`,
        background: `linear-gradient(180deg, ${colors.cream}18 0%, transparent 65%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 0
      }}
    >
      SHARKSTACK
    </div>
  );
}
