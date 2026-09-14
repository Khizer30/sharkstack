import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { useIsMobile } from "@/hooks/useIsMobile";

function RevealWord({ word, index, total, scrollYProgress, rangeEnd }) {
  const start = 0.02 + (index / total) * (rangeEnd - 0.1);
  const end = Math.min(start + 0.1, rangeEnd);
  const color = useTransform(scrollYProgress, [start, end], [colors.gray200, colors.black]);
  return <motion.span style={{ color, display: "inline-block" }}>{word}</motion.span>;
}

export default function ScrollRevealText({ label = "SharkStack", text, background = colors.white }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const words = text.split(" ");
  const isMobile = useIsMobile();

  return (
    <div
      ref={containerRef}
      style={{
        background,
        padding: "clamp(6rem, 12vw, 12rem) clamp(2rem, 6vw, 7rem)"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
          gap: isMobile ? "1rem" : "clamp(2rem, 4vw, 5rem)",
          maxWidth: "1400px",
          margin: "0 auto",
          alignItems: "start"
        }}
      >
        <div style={{ paddingTop: "0.5rem" }}>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
              letterSpacing: "0.12em",
              color: colors.gray800
            }}
          >
            ( {label} )
          </span>
        </div>
        <p
          style={{
            margin: 0,
            ...fonts.poppinsMedium,
            fontSize: "clamp(1.25rem, 2.2vw, 2.25rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.32em"
          }}
        >
          {words.map((word, i) => (
            <RevealWord key={i} word={word} index={i} total={words.length} scrollYProgress={scrollYProgress} rangeEnd={0.65} />
          ))}
        </p>
      </div>
    </div>
  );
}
