import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import StairLetter from "@/components/atoms/StairLetter";
import RevealCard from "@/components/molecules/WhySharkScroll/RevealCard";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { whySharkScrollContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const STAIR_STEP = 0.34;
const TOTAL_LETTERS = whySharkScrollContent.words.join("").length;

export default function WhySharkScroll() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["20%", "-60%", "-60%"]);

  let globalIndex = 0;

  if (isMobile) {
    return (
      <div style={{ background: colors.bgBrand }}>
        <div style={{ padding: "3rem 1.25rem 0.5rem" }}>
          <h2
            style={{
              ...fonts.poppinsBold,
              color: colors.cream,
              fontSize: "clamp(2.25rem, 9vw, 3rem)",
              letterSpacing: "-0.02em",
              margin: 0
            }}
          >
            {whySharkScrollContent.words.join(" ")}
          </h2>
        </div>

        <div className="flex flex-col" style={{ gap: "1.25rem", padding: "1.5rem 1.25rem 3rem" }}>
          {whySharkScrollContent.cards.map((card, i) => (
            <RevealCard key={card.title} card={card} index={i} isMobile pinned={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "340vh", position: "relative" }}>
      <div className="flex items-center" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: colors.bgBrand }}>
        <motion.div className="flex whitespace-nowrap" style={{ x }}>
          {whySharkScrollContent.words.map((word, wi) => (
            <span key={word} className="inline-flex" style={{ marginRight: "clamp(1rem, 3vw, 2.5rem)" }}>
              {word.split("").map((ch, li) => {
                const stair = wi === 0 ? 0 : li * STAIR_STEP;
                const index = globalIndex++;
                return <StairLetter key={li} ch={ch} index={index} totalLetters={TOTAL_LETTERS} stair={stair} scrollYProgress={scrollYProgress} />;
              })}
            </span>
          ))}
        </motion.div>

        <div
          className="absolute inset-x-0 flex"
          style={{
            top: "18%",
            bottom: "14%",
            left: "clamp(1.25rem, 5vw, 4rem)",
            right: "clamp(1.5rem, 5vw, 4rem)",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            zIndex: 2
          }}
        >
          {whySharkScrollContent.cards.map((card, i) => (
            <RevealCard key={card.title} card={card} index={i} scrollYProgress={scrollYProgress} isMobile={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
