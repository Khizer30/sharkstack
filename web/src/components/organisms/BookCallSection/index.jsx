import { InlineWidget } from "react-calendly";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { bookCallContent } from "@/content";

const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

export default function BookCallSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: colors.primary, padding: "clamp(2rem, 5vw, 4rem)" }}>
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
        {bookCallContent.heading}
      </h2>

      <p
        style={{
          ...fonts.montMedium,
          color: colors.black,
          fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
          maxWidth: "28rem",
          position: "relative",
          zIndex: 1,
          marginBottom: "clamp(2rem, 5vw, 3rem)"
        }}
      >
        {bookCallContent.subtext}
      </p>

      <InlineWidget
        url={calendlyUrl}
        styles={{ height: "700px", width: "100%", position: "relative", zIndex: 1 }}
        pageSettings={{
          backgroundColor: "ffffff",
          primaryColor: "f05a28",
          textColor: "000000",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false
        }}
      />
    </section>
  );
}
