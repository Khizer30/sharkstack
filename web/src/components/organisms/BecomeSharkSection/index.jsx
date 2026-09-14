import { ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { becomeSharkContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function BecomeSharkSection({ heading, subtext, buttonLabel, onButtonClick }) {
  const { transitionTo } = usePageTransition();
  const headingText = heading ?? becomeSharkContent.heading;
  const subtextText = subtext ?? becomeSharkContent.subtext;
  const label = buttonLabel ?? becomeSharkContent.buttonLabel;
  const handleClick = onButtonClick ?? (() => transitionTo("/careers"));

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: colors.primary, padding: "clamp(2.5rem, 6vw, 5rem)" }}>
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: "55%",
          backgroundImage: `repeating-linear-gradient(90deg, ${colors.white}55 0px, ${colors.white}55 1px, transparent 1px, transparent 14px)`,
          maskImage: "linear-gradient(to bottom right, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom right, transparent, black)"
        }}
      />

      <h2
        style={{
          ...fonts.poppinsBold,
          color: colors.black,
          fontSize: "clamp(3rem, 8vw, 7rem)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          position: "relative",
          zIndex: 1
        }}
      >
        {headingText}
      </h2>

      <p
        style={{
          ...fonts.montMedium,
          color: colors.black,
          fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
          maxWidth: "28rem",
          position: "relative",
          zIndex: 1,
          marginTop: "1rem",
          marginBottom: "clamp(2rem, 5vw, 3rem)"
        }}
      >
        {subtextText}
      </p>

      <button
        type="button"
        onClick={handleClick}
        className="relative inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
        style={{
          ...fonts.montBold,
          fontSize: "0.9rem",
          letterSpacing: "0.02em",
          color: colors.white,
          backgroundColor: colors.black,
          border: "none",
          padding: "0.4rem 0.4rem 0.4rem 1.5rem",
          gap: "0.75rem",
          zIndex: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.secondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.black;
        }}
      >
        {label}
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: "2.25rem", height: "2.25rem", backgroundColor: colors.primary, color: colors.black }}
        >
          <ArrowRight size={15} />
        </span>
      </button>
    </section>
  );
}
