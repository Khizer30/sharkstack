import { motion, useMotionValue, useTransform } from "motion/react";
import { SearchIcon, ChartIcon, UsersIcon, CheckIcon, LaptopIcon } from "@/assets/svgs";
import CountUp from "@/components/atoms/CountUp";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const ICONS = { search: SearchIcon, chart: ChartIcon, users: UsersIcon, check: CheckIcon, laptop: LaptopIcon };

export default function StatBand({ stage, index, slotVh, topOffset, start = 0, duration = 1, scrollYProgress, isMobile }) {
  const fallbackProgress = useMotionValue(0);
  const progress = scrollYProgress ?? fallbackProgress;
  const end = start + duration;
  const y = useTransform(progress, [start, end], ["100vh", "0vh"], { clamp: true });

  const countRaw = useTransform(progress, [start, end], [0, stage.value], { clamp: true });
  const displayCount = useTransform(countRaw, (v) => Math.round(v).toLocaleString("en-US"));

  const { panelBg, accent, sub, trend, desc } = stage;
  const Icon = ICONS[stage.icon];

  const iconBadge = Icon && (
    <div
      style={{
        width: isMobile ? "1.9rem" : "2.4rem",
        height: isMobile ? "1.9rem" : "2.4rem",
        borderRadius: "50%",
        border: `1px solid ${accent}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accent,
        flexShrink: 0
      }}
    >
      <Icon size={isMobile ? 14 : 18} />
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: panelBg, borderTop: `1px solid ${accent}18` }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            padding: "2rem 1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {iconBadge}
            <div>
              <span
                style={{
                  ...fonts.montSemiBold,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: colors.primary,
                  opacity: 0.7
                }}
              >
                0{index + 1}
              </span>
              <span
                style={{
                  ...fonts.montBold,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: accent,
                  marginLeft: "0.6rem"
                }}
              >
                {stage.label}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <div
              style={{
                ...fonts.poppinsBold,
                fontSize: "clamp(2.4rem, 14vw, 3.2rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: accent
              }}
            >
              <CountUp value={stage.value} />
            </div>
            <span
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: colors.primary,
                padding: "0.2rem 0.6rem",
                border: `1px solid ${colors.primary}40`,
                borderRadius: "100px",
                whiteSpace: "nowrap"
              }}
            >
              {trend}
            </span>
          </div>
          <p
            style={{
              ...fonts.montRegular,
              fontSize: "0.7rem",
              color: `${accent}B3`,
              margin: 0,
              lineHeight: 1.5,
              letterSpacing: "0.01em"
            }}
          >
            {sub}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        y,
        position: "absolute",
        left: 0,
        right: 0,
        top: `${topOffset + index * slotVh}vh`,
        bottom: 0,
        background: panelBg,
        zIndex: index + 1
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "clamp(2rem, 6vw, 7rem)",
          right: "clamp(2rem, 6vw, 7rem)",
          height: "1px",
          background: `${accent}18`
        }}
      />

      <div
        style={{
          height: `${slotVh}vh`,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(2rem, 6vw, 7rem)",
          gap: "clamp(2rem, 4vw, 5rem)"
        }}
      >
        <div style={{ flexShrink: 0, width: "clamp(140px, 16vw, 220px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            {iconBadge}
            <span
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: colors.primary,
                opacity: 0.7
              }}
            >
              0{index + 1}
            </span>
          </div>
          <span
            style={{
              ...fonts.montBold,
              fontSize: "clamp(0.75rem, 1vw, 1rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accent,
              display: "block",
              marginBottom: "0.4rem"
            }}
          >
            {stage.label}
          </span>
          <span
            style={{
              ...fonts.montRegular,
              fontSize: "0.68rem",
              color: `${accent}B3`,
              display: "block",
              letterSpacing: "0.02em",
              lineHeight: 1.5
            }}
          >
            {sub}
          </span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <p
            style={{
              ...fonts.montRegular,
              fontSize: "clamp(0.65rem, 0.85vw, 0.78rem)",
              color: `${accent}99`,
              margin: 0,
              lineHeight: 1.8,
              letterSpacing: "0.04em",
              maxWidth: "340px"
            }}
          >
            {desc}
          </p>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <motion.div
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(3.5rem, 7.2vw, 7.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: accent,
              display: "block"
            }}
          >
            {displayCount}
          </motion.div>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: colors.primary,
              display: "inline-block",
              marginTop: "0.6rem",
              padding: "0.25rem 0.75rem",
              border: `1px solid ${colors.primary}40`,
              borderRadius: "100px"
            }}
          >
            {trend}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
