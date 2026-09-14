import { useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function TextInput({ label, tag = "input", error, onFocus, onBlur, style, ...props }) {
  const [focused, setFocused] = useState(false);
  const Tag = tag;

  return (
    <div>
      {label && (
        <label style={{ ...fonts.montSemiBold, fontSize: "0.8rem", color: colors.textPrimary, display: "block", marginBottom: "0.5rem" }}>{label}</label>
      )}
      <Tag
        {...props}
        style={{
          ...fonts.montRegular,
          fontSize: "0.95rem",
          color: colors.textPrimary,
          width: "100%",
          boxSizing: "border-box",
          padding: "0.85rem 1rem",
          borderRadius: "0.65rem",
          border: `1.5px solid ${focused ? colors.gray400 : colors.borderLight}`,
          outline: "none",
          background: colors.white,
          transition: "border-color 0.2s",
          resize: tag === "textarea" ? "vertical" : undefined,
          ...style
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
      {error && <span style={{ ...fonts.montRegular, fontSize: "0.75rem", color: colors.error, display: "block", marginTop: "0.4rem" }}>{error}</span>}
    </div>
  );
}
