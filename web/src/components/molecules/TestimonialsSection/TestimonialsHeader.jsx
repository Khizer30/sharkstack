import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { testimonialsContent } from "@/content/testimonials";

export default function TestimonialsHeader() {
  return (
    <div
      style={{
        padding: "clamp(2rem, 4vw, 3.5rem) clamp(2rem, 6vw, 6rem) 0",
        flexShrink: 0,
        position: "relative",
        zIndex: 2,
        textAlign: "center"
      }}
    >
      <h2
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: colors.white,
          margin: 0
        }}
      >
        {testimonialsContent.headingLine1}
        <br />
        {testimonialsContent.headingLine2}
      </h2>
    </div>
  );
}
