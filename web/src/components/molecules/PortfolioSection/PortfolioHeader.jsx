import { motion } from "motion/react";
import { lazy, Suspense } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { useIsMobile } from "@/hooks/useIsMobile";

const InteractiveNebulaShader = lazy(() => import("@/components/atoms/InteractiveNebulaShader"));

export default function PortfolioHeader({ label, scale, opacity }) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: isMobile ? "relative" : "sticky",
        top: 0,
        height: isMobile ? "auto" : "100vh",
        padding: isMobile ? "clamp(4rem, 16vw, 6rem) 1.5rem" : 0,
        zIndex: 1,
        marginBottom: isMobile ? 0 : "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        overflow: "hidden",
        background: isMobile ? colors.bgBrand : undefined
      }}
    >
      {!isMobile && (
        <Suspense fallback={<div className="absolute inset-0" style={{ background: colors.bgBrand }} />}>
          <InteractiveNebulaShader />
        </Suspense>
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
        <p
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: `${colors.white}70`
          }}
        >
          {label}
        </p>

        {isMobile ? (
          <h1
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(2.5rem, 12vw, 4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: colors.white
            }}
          >
            Our Work
          </h1>
        ) : (
          <motion.h1
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: colors.white,
              scale,
              opacity,
              transformOrigin: "center center",
              willChange: "transform"
            }}
          >
            Our Work
          </motion.h1>
        )}
      </div>
    </div>
  );
}
