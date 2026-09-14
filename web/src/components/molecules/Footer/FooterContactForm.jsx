import { useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const LABEL = {
  ...fonts.montRegular,
  fontSize: "0.65rem",
  letterSpacing: "0.08em",
  color: `${colors.cream}50`,
  display: "block",
  marginBottom: "0.5rem"
};

const INPUT = {
  ...fonts.poppinsBold,
  fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
  color: `${colors.cream}40`,
  background: "none",
  border: "none",
  borderBottom: `1px solid ${colors.cream}18`,
  outline: "none",
  width: "100%",
  padding: "0.4rem 0 0.75rem",
  lineHeight: 1.1,
  letterSpacing: "-0.01em",
  transition: "border-color 0.25s, color 0.25s",
  resize: "none"
};

function Field({ label, tag = "input", ...props }) {
  const [focused, setFocused] = useState(false);
  const Tag = tag;

  return (
    <div>
      <span style={LABEL}>{label}</span>
      <Tag
        {...props}
        style={{
          ...INPUT,
          borderBottomColor: focused ? `${colors.cream}50` : `${colors.cream}18`,
          color: focused ? `${colors.cream}80` : `${colors.cream}40`
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function FooterContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to submission handler
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <Field label="(Name)" placeholder="YOUR NAME" value={form.name} onChange={set("name")} />
        <Field label="(Phone)*" placeholder="+1 000 000 0000" value={form.phone} onChange={set("phone")} />
      </div>

      <Field label="(Email)" type="email" placeholder="YOUR@EMAIL.COM" value={form.email} onChange={set("email")} />

      <Field label="(Your Message)" tag="textarea" rows={2} placeholder="A BRIEF ABOUT YOUR PROJECT..." value={form.message} onChange={set("message")} />

      <div>
        <button
          type="submit"
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: colors.cream,
            background: "none",
            border: `1px solid ${colors.cream}30`,
            borderRadius: "9999px",
            padding: "0.85rem 2.5rem",
            cursor: "pointer",
            transition: "border-color 0.25s, color 0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${colors.cream}30`;
            e.currentTarget.style.color = colors.cream;
          }}
        >
          Send Message →
        </button>
      </div>
    </form>
  );
}
