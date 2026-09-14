import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "@/assets/svgs";
import Text from "@/components/atoms/Text";
import TimelineDot from "@/components/atoms/TimelineDot";
import StepCard from "@/components/molecules/HiringProcess/StepCard";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { hiringProcessContent } from "@/content";
import { useDimensions } from "@/hooks/useDimensions";
import { scrollToId } from "@/utils/helpers";

export default function HiringProcess() {
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const { height } = useDimensions(cardsRef);
  const steps = hiringProcessContent.steps;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], [0, height]);

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative w-full"
      style={{ background: colors.primary, padding: "clamp(6rem, 10vw, 8rem) clamp(2rem, 6vw, 7rem)" }}
    >
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: "45%",
          backgroundImage: `repeating-linear-gradient(90deg, ${colors.white}40 0px, ${colors.white}40 1px, transparent 1px, transparent 14px)`,
          maskImage: "linear-gradient(to bottom left, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom left, transparent, black)"
        }}
      />

      <div
        className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.5fr)]"
        style={{ columnGap: "clamp(1.5rem, 3vw, 2.5rem)", rowGap: "clamp(2.5rem, 8vw, 3rem)" }}
      >
        <div className="md:sticky self-start" style={{ top: "clamp(6rem, 10vw, 7.5rem)" }}>
          <Text variant="h2" as="h2" color={colors.black} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1.25rem" }}>
            {hiringProcessContent.heading}
          </Text>
          <Text variant="subtitle" as="p" color={`${colors.black}B3`} style={{ marginBottom: "2rem", maxWidth: "22rem" }}>
            {hiringProcessContent.sub}
          </Text>

          <button
            type="button"
            onClick={() => scrollToId("roles")}
            className="relative inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
            style={{
              ...fonts.montBold,
              fontSize: "0.85rem",
              letterSpacing: "0.02em",
              color: colors.white,
              backgroundColor: colors.black,
              border: "none",
              padding: "0.35rem 0.35rem 0.35rem 1.35rem",
              gap: "0.65rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.black;
            }}
          >
            {hiringProcessContent.ctaLabel}
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "2rem", height: "2rem", backgroundColor: colors.primary, color: colors.black }}
            >
              <ArrowRight size={13} />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-[2rem_1fr] md:contents" style={{ columnGap: "0.75rem" }}>
          <div className="relative">
            <div
              className="absolute overflow-hidden"
              style={{ left: "50%", top: 0, width: "2px", height: `${height}px`, background: `${colors.black}30`, transform: "translateX(-50%)" }}
            >
              <motion.div
                className="absolute inset-x-0 top-0 rounded-full"
                style={{
                  width: "2px",
                  height: lineHeight,
                  background: `linear-gradient(to top, ${colors.black}, ${colors.secondary})`,
                  boxShadow: `0 0 10px ${colors.black}60`
                }}
              />
            </div>

            {steps.map((step, i) => (
              <TimelineDot key={step.title} progress={scrollYProgress} threshold={steps.length > 1 ? i / (steps.length - 1) : 0} />
            ))}
          </div>

          <div ref={cardsRef} className="flex flex-col" style={{ gap: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
