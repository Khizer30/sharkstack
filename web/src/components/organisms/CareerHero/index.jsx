import { motion } from "motion/react";
import { useRef, lazy, Suspense } from "react";
import AnimatedWords from "@/components/atoms/AnimatedWords";
import DriftingHeading from "@/components/atoms/DriftingHeading";
import MagneticCursor from "@/components/atoms/MagneticCursor";
import HeroLink from "@/components/molecules/CareerHero/HeroLink";
import ShowreelCard from "@/components/molecules/CareerHero/ShowreelCard";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { careerHeroContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const InteractiveNebulaShader = lazy(() => import("@/components/atoms/InteractiveNebulaShader"));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
});

export default function CareerHero() {
  const heroRef = useRef(null);
  const isMobile = useIsMobile();

  return (
    <section
      ref={heroRef}
      data-cursor-none
      className={
        isMobile
          ? "relative w-full min-h-screen flex items-center overflow-hidden"
          : "relative sticky top-0 w-full min-h-screen flex items-center overflow-hidden"
      }
      style={{
        padding: "clamp(7.5rem, 12vw, 9.5rem) clamp(1.5rem, 6vw, 4rem) clamp(2.5rem, 5vw, 3.5rem)",
        zIndex: 1
      }}
    >
      <Suspense fallback={<div className="absolute inset-0 z-0" style={{ background: colors.bgBrand }} />}>
        <InteractiveNebulaShader className="z-0" />
      </Suspense>

      <MagneticCursor containerRef={heroRef} cursorColor={colors.white} blendMode="exclusion" cursorSize={64}>
        <div className="relative z-10 grid w-full grid-cols-1 md:grid-cols-2 [grid-template-areas:'video'_'heading'_'para'_'links'] md:[grid-template-areas:'video_heading'_'para_links'] gap-x-[clamp(3rem,6vw,5rem)] gap-y-[clamp(2rem,5vw,3rem)] md:gap-y-[clamp(5rem,15vw,11rem)]">
          <div style={{ gridArea: "video" }}>
            <motion.div {...fadeUp(0)} style={{ width: "100%", maxWidth: "28rem" }}>
              <ShowreelCard />
            </motion.div>
          </div>

          <div style={{ gridArea: "heading" }} className="flex items-start">
            <DriftingHeading
              style={{
                ...fonts.poppinsBold,
                color: colors.white,
                fontSize: "clamp(3.25rem, 8vw, 7.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                margin: 0
              }}
            >
              {careerHeroContent.heading}
            </DriftingHeading>
          </div>

          <div style={{ gridArea: "para" }}>
            <AnimatedWords
              text={careerHeroContent.sub}
              style={{
                ...fonts.montRegular,
                color: `${colors.white}B3`,
                fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
                lineHeight: 1.5,
                maxWidth: "34rem"
              }}
            />
          </div>

          <div style={{ gridArea: "links" }} className="flex items-end md:self-end">
            <motion.div {...fadeUp(0.35)} className="flex flex-wrap items-center" style={{ gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
              <HeroLink label={careerHeroContent.linkPrimary.label} target={careerHeroContent.linkPrimary.target} />
              <HeroLink label={careerHeroContent.linkSecondary.label} target={careerHeroContent.linkSecondary.target} />
            </motion.div>
          </div>
        </div>
      </MagneticCursor>
    </section>
  );
}
