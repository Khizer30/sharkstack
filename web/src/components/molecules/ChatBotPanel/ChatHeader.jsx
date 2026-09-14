import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { sharkAiContent } from "@/content";

export default function ChatHeader({ onClose }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.8rem 1rem",
        background: "linear-gradient(180deg, #17181c 0%, #0a0a0c 100%)",
        borderBottom: `1px solid ${colors.white}12`,
        flexShrink: 0
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          style={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: colors.macRed,
            border: "none",
            padding: 0,
            cursor: "pointer"
          }}
        />
        <span aria-hidden style={{ width: 11, height: 11, borderRadius: "50%", background: colors.macYellow, display: "block" }} />
        <span aria-hidden style={{ width: 11, height: 11, borderRadius: "50%", background: colors.macGreen, display: "block" }} />
      </div>

      <span
        style={{
          flex: 1,
          textAlign: "center",
          ...fonts.mono,
          fontSize: "0.72rem",
          color: colors.termMuted,
          letterSpacing: "0.02em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {sharkAiContent.windowTitle}
      </span>
    </div>
  );
}
