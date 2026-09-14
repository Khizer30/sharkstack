import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const steps = ["Discover", "Design", "Architect", "Build", "Test", "Deploy", "Scale"];

export default function ProcessBridge() {
  return (
    <div style={{ color: colors.white, maxWidth: "900px", margin: "0 auto" }}>
      <p
        style={{
          ...fonts.montSemiBold,
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: colors.primary,
          marginBottom: "1.5rem"
        }}
      >
        The framework
      </p>

      <h3
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: colors.white,
          marginBottom: "1.5rem"
        }}
      >
        From first call to final deploy — seven steps, zero shortcuts.
      </h3>

      <p
        style={{
          ...fonts.montRegular,
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: `${colors.white}70`,
          lineHeight: 1.7,
          marginBottom: "3rem",
          maxWidth: "60ch"
        }}
      >
        Every SharkStack engagement follows the same disciplined process. No surprises, no scope creep, no juniors owning critical paths.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {steps.map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              border: `1px solid ${colors.white}18`,
              borderRadius: "9999px",
              padding: "0.5rem 1.1rem"
            }}
          >
            <span
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: colors.primary
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                ...fonts.montMedium,
                fontSize: "0.85rem",
                color: `${colors.white}80`,
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <p
        style={{
          ...fonts.montMedium,
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: `${colors.white}40`,
          marginTop: "3rem"
        }}
      >
        ↓ Continue scrolling to explore the process
      </p>
    </div>
  );
}
