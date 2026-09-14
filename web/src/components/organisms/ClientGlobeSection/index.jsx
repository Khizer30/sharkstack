import { GlobePulse } from "@/components/atoms/GlobePulse";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { clientGlobeContent, globeMarkers } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ClientGlobeSection() {
  const isMobile = useIsMobile();

  const globe = <GlobePulse markers={globeMarkers} speed={0.003} />;

  return (
    <section
      style={{
        background: colors.bgDark,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: isMobile ? "flex-start" : "space-between",
        gap: isMobile ? "2rem" : 0,
        padding: isMobile ? "clamp(4.5rem, 16vw, 5.5rem) 1.5rem 2.5rem" : "60px 60px 52px"
      }}
    >
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          style={{
            ...fonts.montBold,
            fontSize: isMobile ? "clamp(2.25rem, 11vw, 3rem)" : "clamp(2.5rem, 6.2vw, 6.75rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: colors.white,
            margin: 0,
            maxWidth: isMobile ? "100%" : "55vw"
          }}
        >
          {clientGlobeContent.headingLines.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          <span style={{ color: colors.primary }}>{clientGlobeContent.headingAccent}</span>
        </h2>
      </div>

      {isMobile ? (
        <div style={{ position: "relative", zIndex: 1, width: "80vw", maxWidth: "320px", margin: "0 auto", opacity: 0.95 }}>{globe}</div>
      ) : (
        <div
          style={{
            position: "absolute",
            right: "0vw",
            top: "50%",
            transform: "translateY(-50%)",
            width: "56vw",
            maxWidth: "740px",
            zIndex: 1,
            opacity: 0.95
          }}
        >
          {globe}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 2
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <p
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: `${colors.white}4D`,
              margin: 0
            }}
          >
            {clientGlobeContent.statsLabel}
          </p>
          <p
            style={{
              ...fonts.montBold,
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              color: colors.white,
              margin: 0,
              letterSpacing: "-0.02em"
            }}
          >
            {clientGlobeContent.statsValue}
          </p>
          <p
            style={{
              ...fonts.montRegular,
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: colors.primary,
              margin: 0
            }}
          >
            {clientGlobeContent.statsSub}
          </p>
        </div>
      </div>
    </section>
  );
}
