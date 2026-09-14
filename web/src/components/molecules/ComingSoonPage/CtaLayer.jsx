import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";

export default function CtaLayer() {
  return (
    <div className="cta-section absolute z-10 flex flex-col items-center justify-center text-center w-screen px-6">
      <p style={{ color: colors.primary, fontSize: sizes.xs, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
        SharkStack
      </p>
      <TextReveal
        text="Coming soon."
        as="h2"
        fontSize="clamp(2.5rem, 8vw, 6rem)"
        color={colors.white}
        hoverColor={colors.primary}
        staggerDelay={30}
        duration={300}
        direction="up"
        style={{ ...fonts.poppinsBold, marginBottom: "1.5rem" }}
      />
      <p style={{ ...fonts.montRegular, fontSize: sizes.lg, color: colors.slate400, maxWidth: "28rem", lineHeight: 1.7 }}>
        Something great is on its way. Stay tuned.
      </p>
    </div>
  );
}
