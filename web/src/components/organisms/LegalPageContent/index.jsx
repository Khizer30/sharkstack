import SectionLabel from "@/components/atoms/SectionLabel";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";

export default function LegalPageContent({ label, heading, updated, intro, sections }) {
  return (
    <section
      className="relative w-full"
      style={{
        background: colors.bgPrimary,
        padding: "clamp(8rem, 12vw, 10rem) clamp(1.5rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)"
      }}
    >
      <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
        <SectionLabel label={label} />

        <h1 style={{ ...textVariants.h1, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginTop: "1.5rem" }}>{heading}</h1>

        <p
          style={{
            ...fonts.montRegular,
            fontSize: "0.8rem",
            letterSpacing: "0.04em",
            color: colors.textMuted,
            marginTop: "0.75rem"
          }}
        >
          {updated}
        </p>

        <p style={{ ...textVariants.body, color: colors.textSecondary, marginTop: "2rem" }}>{intro}</p>

        <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 style={{ ...textVariants.h3, marginBottom: "0.75rem" }}>{section.heading}</h2>

              {section.paragraphs?.map((paragraph, i) => (
                <p key={i} style={{ ...textVariants.body, color: colors.textSecondary, marginBottom: "0.75rem" }}>
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.25rem" }}>
                  {section.bullets.map((bullet, i) => (
                    <li key={i} style={{ ...textVariants.body, color: colors.textSecondary, listStyle: "disc" }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
