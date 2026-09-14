import { useState } from "react";
import Text from "@/components/atoms/Text";
import BenefitCard from "@/components/molecules/WorkBenefitsCards/BenefitCard";
import { colors } from "@/constants/colors";
import { workBenefitsCardsContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function WorkBenefitsCards() {
  const cards = workBenefitsCardsContent.cards;
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  const gridStyle = isMobile
    ? { gridTemplateRows: cards.map((_, i) => (i === activeIndex ? "5fr" : "1fr")).join(" ") }
    : { gridTemplateColumns: cards.map((_, i) => (i === activeIndex ? "5fr" : "1fr")).join(" ") };

  return (
    <section className="relative w-full" style={{ background: colors.bgDark, padding: "clamp(6rem, 10vw, 8rem) clamp(2rem, 6vw, 7rem)", zIndex: 2 }}>
      <Text variant="h2" as="h2" color={colors.white} style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        {workBenefitsCardsContent.heading}
      </Text>

      <ul
        className="grid w-full"
        style={{
          ...gridStyle,
          gap: "0.5rem",
          height: isMobile ? "640px" : "520px",
          transition: "grid-template-columns 0.5s ease-out, grid-template-rows 0.5s ease-out"
        }}
      >
        {cards.map((card, i) => (
          <BenefitCard key={card.id} card={card} active={i === activeIndex} onActivate={() => setActiveIndex(i)} />
        ))}
      </ul>
    </section>
  );
}
