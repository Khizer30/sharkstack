import { motion } from "motion/react";
import { useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { sharkAiContent } from "@/content";

export default function ChatInputBar({ value, onChange, onSend, onClear, disabled }) {
  const [focused, setFocused] = useState(false);
  const canSend = !disabled && value.trim();

  const submit = () => {
    if (!canSend) return;
    onSend(value);
  };

  return (
    <div style={{ padding: "0.85rem 1.1rem 1rem", borderTop: `1px solid ${colors.white}14`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderRadius: "0.6rem",
            border: `1px solid ${focused ? colors.primary : `${colors.white}22`}`,
            boxShadow: focused ? `0 0 0 3px ${colors.primary}22` : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            background: `${colors.white}08`,
            padding: "0.6rem 0.9rem"
          }}
        >
          <span style={{ ...fonts.mono, color: colors.termDim, fontSize: "0.85rem" }}>$</span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={sharkAiContent.placeholder}
            style={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...fonts.mono,
              fontSize: "1rem",
              color: colors.white
            }}
          />
        </div>

        <motion.button
          type="button"
          aria-label="Send message"
          onClick={submit}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.15, x: 2 } : {}}
          whileTap={canSend ? { scale: 0.85 } : {}}
          transition={{ type: "spring", stiffness: 420, damping: 16 }}
          style={{
            ...fonts.monoBold,
            fontSize: "1.2rem",
            color: canSend ? colors.primary : `${colors.white}30`,
            background: "transparent",
            border: "none",
            cursor: canSend ? "pointer" : "not-allowed",
            padding: "0.3rem 0.2rem",
            lineHeight: 1
          }}
        >
          ❯
        </motion.button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <button
          type="button"
          onClick={onClear}
          style={{
            ...fonts.mono,
            fontSize: "0.7rem",
            color: `${colors.white}50`,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = `${colors.white}50`;
          }}
        >
          {sharkAiContent.clearLabel}
        </button>
      </div>
    </div>
  );
}
