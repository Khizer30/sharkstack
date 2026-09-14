import { forwardRef } from "react";
import SectionLabel from "@/components/atoms/SectionLabel";
import { colors } from "@/constants/colors";
import { PANEL_BG } from "@/constants/projectDetail";
import { fonts } from "@/constants/typography";

const MobileProjectDrawer = forwardRef(function MobileProjectDrawer({ project }, ref) {
  const n = project.technologies?.length ?? 0;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: PANEL_BG,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${colors.white}08`,
        transform: "translateX(100%)",
        zIndex: 25,
        overflowY: "auto",
        padding: "3.5rem 1.5rem 3rem",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Orange accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${colors.primary}50, transparent)`
        }}
      />

      {/* Eyebrow */}
      <div style={{ marginBottom: "2.5rem" }}>
        <SectionLabel label="Project Details" />
      </div>

      {/* Problem & Solution */}
      <p
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(1.8rem, 7vw, 2.6rem)",
          letterSpacing: "-0.04em",
          color: colors.white,
          margin: "0 0 1.2rem",
          lineHeight: 0.92
        }}
      >
        Problem &<br />
        <span style={{ color: colors.white }}>Solution</span>
      </p>
      <p
        style={{
          ...fonts.montRegular,
          fontSize: "clamp(0.88rem, 3.4vw, 1rem)",
          lineHeight: 1.85,
          color: `${colors.white}b0`,
          margin: "0 0 3rem"
        }}
      >
        {project.problemSolution}
      </p>

      {/* Capabilities header */}
      <div
        style={{
          borderTop: `1px solid ${colors.white}08`,
          paddingTop: "2rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "baseline",
          gap: "0.6rem"
        }}
      >
        <p
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(1.8rem, 7vw, 2.6rem)",
            letterSpacing: "-0.04em",
            color: colors.white,
            margin: 0,
            lineHeight: 0.92
          }}
        >
          Capabilities
        </p>
        <span
          style={{
            ...fonts.poppinsBold,
            fontSize: "0.6rem",
            color: `${colors.primary}40`,
            letterSpacing: "0.1em"
          }}
        >
          {String(n).padStart(2, "0")}
        </span>
      </div>

      {/* Tech items */}
      <div>
        {project.technologies?.map((tech, i) => (
          <div
            key={i}
            data-tech-item
            style={{
              opacity: 0,
              transform: "translateX(28px)",
              borderTop: `1px solid ${colors.white}08`,
              padding: "1rem 0",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              position: "relative"
            }}
          >
            <div
              data-active-bar
              style={{
                position: "absolute",
                left: 0,
                top: "20%",
                bottom: "20%",
                width: "2px",
                borderRadius: "1px",
                background: colors.primary,
                opacity: 0
              }}
            />
            <span
              data-num
              style={{
                ...fonts.poppinsBold,
                fontSize: "0.58rem",
                color: `${colors.white}25`,
                flexShrink: 0,
                width: "1.5rem",
                letterSpacing: "0.06em"
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              data-text
              style={{
                ...fonts.montSemiBold,
                fontSize: "clamp(0.85rem, 3.4vw, 0.98rem)",
                color: `${colors.white}70`,
                flex: 1,
                lineHeight: 1.4
              }}
            >
              {tech}
            </span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${colors.white}08` }} />
      </div>
    </div>
  );
});

export default MobileProjectDrawer;
