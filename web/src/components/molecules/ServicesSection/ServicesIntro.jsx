import { lazy, Suspense } from "react";
import { FlowSection } from "@/components/atoms/FlowArtServiceSection";
import TextScramble from "@/components/atoms/TextScramble";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { servicesIntroContent } from "@/content";

const InteractiveNebulaShader = lazy(() => import("@/components/atoms/InteractiveNebulaShader"));

export default function ServicesIntro() {
  return (
    <FlowSection aria-label="Our Services" style={{ backgroundColor: colors.bgDark, color: colors.white }}>
      <Suspense fallback={<div className="absolute inset-0" style={{ background: colors.bgBrand }} />}>
        <InteractiveNebulaShader />
      </Suspense>

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TextScramble
          text={servicesIntroContent.heading}
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(2rem, 8vw, 8rem)",
            color: colors.white,
            letterSpacing: "-0.02em"
          }}
        />
      </div>
    </FlowSection>
  );
}
