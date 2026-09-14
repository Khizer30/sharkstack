import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function FollowButton({ text, cursor, opacity, scale }) {
  return (
    <div
      className="pointer-events-none flex items-center gap-3 rounded-full"
      style={{
        position: "fixed",
        left: cursor.x,
        top: cursor.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        background: colors.white,
        color: colors.black,
        padding: "1rem 1.75rem",
        whiteSpace: "nowrap",
        zIndex: 60,
        transition: "opacity 0.2s ease"
      }}
    >
      <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: colors.primary }} />
      <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem" }}>{text}</span>
    </div>
  );
}
