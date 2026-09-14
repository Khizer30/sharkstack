import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { aboutFounderContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const IMAGE_HEIGHT = { mobile: 340, desktop: 480 };

export default function AboutFounder() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const targetHeight = isMobile ? IMAGE_HEIGHT.mobile : IMAGE_HEIGHT.desktop;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.3"]
  });

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const imageHeight = useTransform(scrollYProgress, [0, 1], [targetHeight * 0.14, targetHeight]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.1, 0.75], [16, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: colors.black, padding: "clamp(4rem, 8vw, 6rem) clamp(2rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)" }}
    >
      <motion.div
        style={{
          scaleX: barScale,
          transformOrigin: "left",
          height: "6px",
          width: "100%",
          background: colors.primary,
          marginBottom: "3rem"
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
        <div>
          <motion.span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: `${colors.white}70`,
              display: "block",
              marginBottom: "1.25rem",
              opacity: textOpacity,
              y: textY
            }}
          >
            {aboutFounderContent.eyebrow}
          </motion.span>

          <motion.h2
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              letterSpacing: "-0.02em",
              color: colors.white,
              lineHeight: 1.1,
              opacity: textOpacity,
              y: textY
            }}
          >
            {aboutFounderContent.headingPrefix} <span style={{ color: colors.primary }}>{aboutFounderContent.name}</span>
          </motion.h2>

          <motion.div style={{ borderTop: `1px solid ${colors.white}1F`, margin: "2rem 0", opacity: textOpacity }} />

          <motion.p
            style={{
              ...fonts.poppinsMedium,
              fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: colors.white,
              maxWidth: "34rem",
              opacity: textOpacity,
              y: textY
            }}
          >
            {aboutFounderContent.quote}
          </motion.p>

          <motion.p
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              color: colors.white,
              marginTop: "1.5rem",
              opacity: textOpacity
            }}
          >
            {aboutFounderContent.name}
            <span style={{ color: `${colors.white}66`, fontWeight: 400 }}> — {aboutFounderContent.role}</span>
          </motion.p>
        </div>

        <motion.div
          style={{
            height: imageHeight,
            border: `1px solid ${colors.white}14`,
            boxShadow: `0 30px 60px -20px ${colors.black}90`
          }}
          className="relative overflow-hidden w-full md:w-[26rem]"
        >
          <motion.img
            src={aboutFounderContent.image}
            alt={aboutFounderContent.name}
            className="absolute left-0 top-0 w-full object-cover"
            style={{ height: targetHeight, scale: imageScale, transformOrigin: "top" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
