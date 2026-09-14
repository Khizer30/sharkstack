import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import FocusCard from "@/components/molecules/CareerFocusCards/FocusCard";
import { colors } from "@/constants/colors";
import { careerFocusContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function CareerFocusCards() {
  const cards = careerFocusContent.cards;
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: isMobile ? "clamp(34rem, 130vw, 42rem)" : "clamp(34rem, 60vw, 44rem)",
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"
      }}
    >
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          className="fixed left-0 w-full pointer-events-none"
          style={{ top: "-10%", height: "120%", y, opacity: i === activeIndex ? 1 : 0, transition: "opacity 0.7s ease" }}
        >
          <img src={card.image} alt={card.alt} className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>
      ))}

      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.black}99, ${colors.black}33 45%, ${colors.black}55)` }} />

      <div
        className={isMobile ? "absolute inset-x-0 bottom-0 flex flex-col" : "absolute inset-x-0 bottom-0 flex items-end justify-center"}
        style={{ gap: "clamp(0.75rem, 1.5vw, 1.25rem)", padding: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        {cards.map((card, i) => (
          <FocusCard key={card.id} card={card} active={i === activeIndex} onHover={() => setActiveIndex(i)} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
