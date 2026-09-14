import { motion } from "motion/react";
import { lazy, Suspense } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { heroContent } from "@/content";

const LiquidGradient = lazy(() => import("@/components/atoms/LiquidGradientBackground"));
const TextParticle = lazy(() => import("@/components/atoms/TextParticle"));

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0" style={{ background: colors.bgDark }} />}>
        <LiquidGradient dark />
      </Suspense>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "18rem",
          background: `linear-gradient(to bottom, transparent, ${colors.secondary})`,
          zIndex: 6,
          pointerEvents: "none"
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ paddingTop: "7rem" }}>
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: `${colors.white}73`,
            marginBottom: "0.75rem"
          }}
        >
          {heroContent.eyebrow}
        </motion.span>

        <div className="w-full max-w-7xl" style={{ height: "30rem" }}>
          <Suspense fallback={null}>
            <TextParticle text={heroContent.particleText} fontSize={720} particleSize={2} particleDensity={5} />
          </Suspense>
        </div>

        <p
          style={{
            ...fonts.poppinsMedium,
            fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
            color: `${colors.white}80`,
            letterSpacing: "0.01em",
            lineHeight: 1.7,
            maxWidth: "36rem",
            marginTop: "-1rem"
          }}
        >
          {heroContent.tagline} <span style={{ color: colors.primary }}>{heroContent.taglineAccent}</span>
        </p>
      </div>
    </div>
  );
}
