import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{ width: "1.2rem", height: "1px", background: `${colors.primary}60` }} />
      <span
        style={{
          ...fonts.montMedium,
          fontSize: "0.46rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: colors.primary
        }}
      >
        {label}
      </span>
    </div>
  );
}
