import { motion } from "motion/react";
import CountUp from "@/components/atoms/CountUp";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";

export default function ImpactMetricColumn({ metric, delay = 0 }) {
  const trendColor = metric.trendUp ? colors.termSuccess : colors.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}
    >
      <div style={{ width: "3px", height: "34px", marginTop: "3px", borderRadius: "2px", background: trendColor, flexShrink: 0 }} />

      <div>
        <span
          style={{
            ...fonts.montBold,
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.white,
            display: "block",
            marginBottom: "0.5rem"
          }}
        >
          {metric.label}
        </span>

        <div style={{ ...fonts.poppinsBold, fontSize: "clamp(2rem, 4vw, 2.75rem)", color: colors.white, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <CountUp value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: trendColor,
              border: `1px solid ${trendColor}40`,
              borderRadius: "100px",
              padding: "0.22rem 0.7rem"
            }}
          >
            {metric.change}
          </span>
          <span style={{ ...fonts.montRegular, fontSize: sizes.xs, color: `${colors.white}55` }}>{metric.prevLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
