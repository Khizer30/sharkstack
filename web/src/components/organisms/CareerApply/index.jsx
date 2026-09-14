import { lazy, Suspense } from "react";
import Text from "@/components/atoms/Text";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { applyContent } from "@/content";

const LiquidGradient = lazy(() => import("@/components/atoms/LiquidGradientBackground"));

export default function CareerApply() {
  return (
    <section
      id="apply"
      className="relative w-full flex flex-col items-center text-center overflow-hidden"
      style={{
        background: colors.bgBrand,
        padding: "clamp(6rem, 12vw, 9rem) clamp(2rem, 6vw, 6rem)"
      }}
    >
      <Suspense fallback={<div style={{ position: "absolute", inset: 0, background: colors.bgBrand }} />}>
        <LiquidGradient dark />
      </Suspense>

      <div className="relative" style={{ zIndex: 1, maxWidth: "38rem" }}>
        <Text variant="h2" as="h2" color={colors.white} style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", letterSpacing: "-0.02em" }}>
          {applyContent.heading}
        </Text>

        <Text variant="subtitle" color={`${colors.white}80`} style={{ marginTop: "1.25rem", fontSize: "clamp(1rem, 1.4vw, 1.1rem)" }}>
          {applyContent.subtext}
        </Text>

        <div className="flex flex-col items-center" style={{ marginTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
          <a
            href={`mailto:${applyContent.email}`}
            style={{ ...fonts.montBold, color: colors.primary, fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", textDecoration: "none" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
          >
            {applyContent.email}
          </a>
        </div>
      </div>
    </section>
  );
}
