import { useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const LABEL = {
  ...fonts.montRegular,
  fontSize: "0.65rem",
  letterSpacing: "0.08em",
  color: colors.textMuted,
  display: "block",
  marginBottom: "0.5rem"
};

const ERROR_TEXT = {
  ...fonts.montRegular,
  fontSize: "0.7rem",
  color: colors.error,
  display: "block",
  marginTop: "0.35rem"
};

const INPUT_BASE = {
  ...fonts.poppinsBold,
  fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
  background: "none",
  border: "none",
  outline: "none",
  width: "100%",
  padding: "0.2rem 0 0.5rem",
  letterSpacing: "-0.01em",
  lineHeight: 1.1,
  transition: "border-color 0.2s, color 0.2s",
  resize: "none"
};

export default function FormField({ label, tag = "input", error, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  const Tag = tag;
  const filled = Boolean(props.value);

  return (
    <div>
      <span style={LABEL}>{label}</span>
      <Tag
        {...props}
        style={{
          ...INPUT_BASE,
          borderBottom: `1px solid ${error ? colors.error : focused ? colors.textMuted : colors.borderLight}`,
          color: focused || filled ? colors.textPrimary : colors.gray400
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
      {error && <span style={ERROR_TEXT}>{error}</span>}
    </div>
  );
}
