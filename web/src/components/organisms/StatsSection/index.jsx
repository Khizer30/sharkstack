import { useScroll } from "motion/react";
import { useRef } from "react";
import StatBand from "@/components/molecules/StatsSection/StatBand";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { funnelStages, statsContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const STATS = funnelStages.slice(0, 4);
const STAGGER = 0.14;
const DURATION = 0.32;
const NAV_CLEARANCE = 9;
const SLOT_VH = (100 - NAV_CLEARANCE) / STATS.length;

export default function StatsSection() {
  const wrapperRef = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  if (isMobile) {
    return (
      <div style={{ background: STATS[0].panelBg, paddingTop: "2.5rem" }}>
        <div style={{ padding: "0 clamp(2rem, 6vw, 7rem)", marginBottom: "1.5rem" }}>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: `${colors.white}25`
            }}
          >
            ( {statsContent.label} )
          </span>
        </div>

        {STATS.map((stage, i) => (
          <StatBand key={stage.label} stage={stage} index={i} isMobile />
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ height: "350vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: STATS[0].panelBg
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "clamp(5.5rem, 4vw, 6.5rem)",
            left: "clamp(2rem, 6vw, 7rem)",
            zIndex: 10
          }}
        >
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: `${colors.white}25`
            }}
          >
            ( {statsContent.label} )
          </span>
        </div>

        {STATS.map((stage, i) => (
          <StatBand
            key={stage.label}
            stage={stage}
            index={i}
            slotVh={SLOT_VH}
            topOffset={NAV_CLEARANCE}
            start={i * STAGGER}
            duration={DURATION}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
