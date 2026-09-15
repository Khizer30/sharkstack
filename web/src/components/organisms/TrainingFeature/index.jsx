import meezanBankLogo from "@/assets/images/meezan-bank-logo.png";
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DollarIcon,
  HourglassIcon,
  LaptopIcon,
  RocketIcon,
  SparkleIcon,
  UsersIcon,
  WhatsappIcon
} from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import SectionLabel from "@/components/atoms/SectionLabel";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { trainingContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

const ICONS = {
  calendar: CalendarIcon,
  book: BookIcon,
  users: UsersIcon,
  sparkles: SparkleIcon,
  sparkle: SparkleIcon,
  hourglass: HourglassIcon,
  rocket: RocketIcon,
  clock: ClockIcon,
  timer: ClockIcon,
  laptop: LaptopIcon,
  dollar: DollarIcon
};

const sectionHeading = {
  ...fonts.poppinsSemiBold,
  fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
  color: colors.textPrimary,
  margin: "0 0 1.25rem",
  letterSpacing: "-0.01em"
};

export default function TrainingFeature() {
  const { transitionTo } = usePageTransition();

  return (
    <section
      id="training"
      className="relative w-full"
      style={{ background: colors.bgPrimary, padding: "clamp(8rem, 12vw, 10rem) clamp(1.5rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)" }}
    >
      <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SectionLabel label={trainingContent.label} />
        </div>

        <h1 style={{ ...textVariants.h1, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginTop: "1.5rem" }}>{trainingContent.heading}</h1>

        <p style={{ ...textVariants.body, color: colors.textSecondary, marginTop: "1.25rem" }}>{trainingContent.subheading}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "clamp(1rem, 2vw, 1.5rem)",
          maxWidth: "56rem",
          margin: "clamp(3rem, 5vw, 4rem) auto 0"
        }}
      >
        {trainingContent.highlights.map((highlight) => {
          const Icon = ICONS[highlight.icon];
          return (
            <div
              key={highlight.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "clamp(1.25rem, 2vw, 1.5rem)",
                borderRadius: "1rem",
                border: `1px solid ${colors.borderLight}`,
                background: colors.bgCard
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "0.75rem",
                  background: `${colors.primary}14`,
                  color: colors.primary,
                  flexShrink: 0
                }}
              >
                {Icon && <Icon size={20} />}
              </span>
              <div>
                <span style={{ ...fonts.montRegular, fontSize: "0.75rem", letterSpacing: "0.05em", color: colors.textMuted, display: "block" }}>
                  {highlight.label}
                </span>
                <span style={{ ...fonts.poppinsSemiBold, fontSize: "1.05rem", color: colors.textPrimary }}>{highlight.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: "clamp(2.5rem, 5vw, 4rem)", maxWidth: "62rem", margin: "clamp(3.5rem, 6vw, 5rem) auto 0" }}
      >
        <div>
          <h2 style={sectionHeading}>{trainingContent.overviewHeading}</h2>
          {trainingContent.overview.map((paragraph) => (
            <p key={paragraph} style={{ ...fonts.montRegular, fontSize: "1rem", color: colors.textSecondary, lineHeight: 1.7, margin: "0 0 1rem" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          <h2 style={sectionHeading}>{trainingContent.curriculumHeading}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {trainingContent.curriculum.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                <span style={{ color: colors.primary, display: "flex", marginTop: "0.15rem", flexShrink: 0 }}>
                  <CheckIcon size={18} />
                </span>
                <span style={{ ...fonts.montRegular, fontSize: "1rem", color: colors.textSecondary, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(3rem, 6vw, 4.5rem)" }}>
        <Button onClick={() => transitionTo("/ai-training/form")}>{trainingContent.ctaLabel}</Button>
      </div>
    </section>
  );
}
