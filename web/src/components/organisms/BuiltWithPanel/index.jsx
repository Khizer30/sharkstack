import { forwardRef } from "react";
import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { PANEL_BG, toolIconUrl } from "@/constants/projectDetail";
import { fonts } from "@/constants/typography";

const PILL_BG = "rgba(255,255,255,0.06)";
const PILL_BORDER = "rgba(255,255,255,0.10)";

const onPillEnter = (e) => {
  e.currentTarget.style.background = colors.bgBrand;
  e.currentTarget.style.transform = "scale(1.06)";
};

const onPillLeave = (e) => {
  e.currentTarget.style.background = PILL_BG;
  e.currentTarget.style.transform = "scale(1)";
};

const onRowEnter = (e) => {
  const strip = e.currentTarget.querySelector("[data-strip]");
  if (strip) strip.style.animationPlayState = "paused";
};

const onRowLeave = (e) => {
  const strip = e.currentTarget.querySelector("[data-strip]");
  if (strip) strip.style.animationPlayState = "running";
};

const BuiltWithPanel = forwardRef(function BuiltWithPanel({ project, isMobile }, ref) {
  const tools = project.tools ?? [];
  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)];

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: PANEL_BG,
        clipPath: "inset(0 0 100% 0)",
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${colors.primary}08 0%, transparent 65%)`
        }}
      />

      <div
        data-tools-head
        style={{
          opacity: 0,
          transform: "translateY(20px)",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
          textAlign: "center"
        }}
      >
        <TextReveal
          text="Built With"
          as="p"
          fontSize={isMobile ? "clamp(2rem, 8vw, 2.8rem)" : "clamp(2.2rem, 3.8vw, 3.2rem)"}
          color={colors.white}
          hoverColor={colors.primary}
          style={{ margin: 0, letterSpacing: "-0.04em", padding: 0 }}
        />
      </div>

      {rows.map((rowTools, rowIdx) => {
        let base = [...rowTools];
        while (base.length < 8) base = [...base, ...rowTools];
        const strip = [...base, ...base];
        const goLeft = rowIdx === 0;
        const speed = goLeft ? 28 : 34;

        return (
          <div
            key={rowIdx}
            data-ticker-row={rowIdx}
            onMouseEnter={onRowEnter}
            onMouseLeave={onRowLeave}
            style={{
              width: "100vw",
              overflow: "hidden",
              opacity: 0,
              transform: "translateY(18px)",
              marginBottom: rowIdx === 0 ? "0.8rem" : 0,
              maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              position: "relative",
              zIndex: 1
            }}
          >
            <div
              data-strip
              style={{
                display: "flex",
                width: "max-content",
                animation: `${goLeft ? "ticker-left" : "ticker-right"} ${speed}s linear infinite`,
                willChange: "transform"
              }}
            >
              {strip.map((tool, i) => {
                const iconUrl = toolIconUrl(tool);
                return (
                  <div
                    key={i}
                    onMouseEnter={onPillEnter}
                    onMouseLeave={onPillLeave}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "0.5rem" : "0.65rem",
                      padding: isMobile ? "0.6rem 1rem" : "0.75rem 1.25rem",
                      background: PILL_BG,
                      border: `1px solid ${PILL_BORDER}`,
                      borderRadius: "100px",
                      marginRight: "0.7rem",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      transition: "background 0.22s ease, transform 0.22s ease"
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: isMobile ? 18 : 24,
                        height: isMobile ? 18 : 24,
                        flexShrink: 0,
                        borderRadius: "6px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span style={{ ...fonts.poppinsBold, fontSize: "0.45rem", color: `${colors.white}60` }}>{tool[0]}</span>
                      {iconUrl && (
                        <img
                          src={iconUrl}
                          alt=""
                          style={{
                            position: "absolute",
                            inset: "2px",
                            width: "calc(100% - 4px)",
                            height: "calc(100% - 4px)",
                            objectFit: "contain"
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        ...fonts.montSemiBold,
                        fontSize: isMobile ? "0.76rem" : "0.85rem",
                        color: `${colors.white}cc`,
                        letterSpacing: "0.02em"
                      }}
                    >
                      {tool}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default BuiltWithPanel;
