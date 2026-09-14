import { useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import EyebrowLabel from "@/components/atoms/EyebrowLabel";
import ScrollFillLine from "@/components/atoms/ScrollFillLine";
import Word from "@/components/atoms/Word";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { aboutTeamContent } from "@/content";

export default function AboutTeamHeading() {
  const containerRef = useRef(null);

  const { scrollYProgress: raw } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.35"]
  });
  const progress = useSpring(raw, { stiffness: 60, damping: 22, restDelta: 0.001 });

  const words = aboutTeamContent.heading.split(" ");

  return (
    <div ref={containerRef} className="mb-8 md:mb-4">
      <EyebrowLabel label={aboutTeamContent.eyebrow} style={{ marginBottom: "1rem" }} />
      <ScrollFillLine progress={progress} style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }} />
      <h2
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          color: colors.white,
          letterSpacing: "-0.02em",
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "0 0.28em"
        }}
      >
        {words.map((word, i) => (
          <Word key={i} word={word} index={i} total={words.length} progress={progress} />
        ))}
      </h2>
    </div>
  );
}
