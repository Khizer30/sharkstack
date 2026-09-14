import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import EyebrowLabel from "@/components/atoms/EyebrowLabel";
import ScrollFillLine from "@/components/atoms/ScrollFillLine";
import Word from "@/components/atoms/Word";
import SteppedTextReveal from "@/components/molecules/TextBgReveal/SteppedTextReveal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { textRevealContent } from "@/content";

export default function TextBgReveal({
  label = textRevealContent.label,
  text = textRevealContent.text,
  steps,
  animateColors = true,
  staticBg = colors.bgDark,
  staticTextColor = colors.white,
  showProgressBar = false
}) {
  const containerRef = useRef(null);

  const { scrollYProgress: raw } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const progress = useSpring(raw, { stiffness: 60, damping: 22, restDelta: 0.001 });

  const animatedBg = useTransform(progress, [0.3, 0.85], [colors.white, colors.statsPanel1]);
  const animatedTextColor = useTransform(progress, [0.28, 0.75], [colors.textPrimary, colors.white]);
  const labelOpacity = useTransform(progress, [0.28, 0.65], [1, 0.35]);

  const bg = animateColors ? animatedBg : staticBg;
  const textColor = animateColors ? animatedTextColor : staticTextColor;

  if (steps) {
    return <SteppedTextReveal label={label} steps={steps} staticBg={staticBg} staticTextColor={staticTextColor} />;
  }

  const words = text.split(" ");

  return (
    <div ref={containerRef} style={{ height: "320vh", position: "relative" }}>
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: bg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(2rem, 6vw, 7rem)",
            width: "100%"
          }}
        >
          {showProgressBar && (
            <>
              <EyebrowLabel label={label} style={{ marginBottom: "1rem" }} />
              <ScrollFillLine progress={progress} trackColor={`${staticTextColor}1A`} style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }} />
            </>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: showProgressBar ? "1fr" : "max-content 1fr",
              gap: "clamp(2rem, 4vw, 5rem)",
              alignItems: "start"
            }}
          >
            {!showProgressBar && (
              <div style={{ paddingTop: "0.5rem" }}>
                <EyebrowLabel label={label} opacity={labelOpacity} />
              </div>
            )}

            <motion.p
              style={{
                margin: 0,
                ...fonts.poppinsMedium,
                fontSize: "clamp(1.5rem, 3vw, 3rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: textColor,
                display: "flex",
                flexWrap: "wrap",
                gap: "0 0.32em"
              }}
            >
              {words.map((word, i) => (
                <Word key={i} word={word} index={i} total={words.length} progress={progress} />
              ))}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
