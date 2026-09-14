import { lazy, Suspense } from "react";
import CTAContactLinks from "@/components/molecules/CTASection/CTAContactLinks";
import CTAHeading from "@/components/molecules/CTASection/CTAHeading";
import { colors } from "@/constants/colors";

const LiquidGradient = lazy(() => import("@/components/atoms/LiquidGradientBackground"));

export default function CTASection() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: colors.bgBrand,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(4rem, 8vw, 8rem) clamp(2rem, 6vw, 6rem)",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <Suspense fallback={<div style={{ position: "absolute", inset: 0, background: colors.bgBrand }} />}>
        <LiquidGradient dark />
      </Suspense>

      <div style={{ position: "relative", zIndex: 1 }}>
        <CTAHeading />

        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: `${colors.cream}20`,
            marginBottom: "clamp(2rem, 4vw, 4rem)"
          }}
        />

        <CTAContactLinks />
      </div>
    </section>
  );
}
