import { forwardRef } from "react";
import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { PANEL_BG } from "@/constants/projectDetail";
import { fonts } from "@/constants/typography";

const ProblemSolutionPanel = forwardRef(function ProblemSolutionPanel({ project }, ref) {
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "46vw",
        height: "100vh",
        padding: "0 4.5vw 0 3.5vw",
        background: PANEL_BG,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transform: "translateX(100%)",
        opacity: 0,
        zIndex: 20,
        pointerEvents: "none"
      }}
    >
      <div style={{ margin: "0 0 1rem", lineHeight: 0.92 }}>
        <TextReveal
          text="Problem &"
          as="p"
          fontSize="clamp(2rem, 3vw, 2.7rem)"
          color={colors.white}
          hoverColor={colors.primary}
          style={{ margin: 0, letterSpacing: "-0.04em", padding: 0, display: "block" }}
        />
        <TextReveal
          text="Solution"
          as="p"
          fontSize="clamp(2rem, 3vw, 2.7rem)"
          color={colors.white}
          hoverColor={colors.primary}
          style={{ margin: 0, letterSpacing: "-0.04em", padding: 0, display: "block" }}
        />
      </div>

      <div
        data-ps-divider
        style={{
          width: "2rem",
          height: "1.5px",
          background: `${colors.white}15`,
          margin: "0 0 1.4rem",
          borderRadius: "1px",
          opacity: 0,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "opacity 0.4s ease, transform 0.5s ease"
        }}
      />

      <p
        data-ps-body
        style={{
          ...fonts.montRegular,
          fontSize: "clamp(0.88rem, 1.25vw, 1.05rem)",
          lineHeight: 1.9,
          color: `${colors.white}bb`,
          margin: 0,
          maxWidth: "36ch",
          opacity: 0,
          transform: "translateY(14px)"
        }}
      >
        {project.problemSolution}
      </p>
    </div>
  );
});

export default ProblemSolutionPanel;
