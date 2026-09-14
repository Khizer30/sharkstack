import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import CountUp from "@/components/atoms/CountUp";
import ImpactLineChart from "@/components/molecules/TechImpactSection/ImpactLineChart";
import ImpactMetricColumn from "@/components/molecules/TechImpactSection/ImpactMetricColumn";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";
import { techImpactContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function TechImpactSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const { headline } = techImpactContent;
  const isMobile = useIsMobile();

  return (
    <section ref={containerRef} style={{ position: "relative", overflow: "hidden", padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)" }}>
      <div style={{ position: "absolute", inset: "-10% 0", zIndex: 0 }}>
        <motion.div style={{ position: "relative", height: "120%", width: "100%", y }}>
          <img
            src={techImpactContent.backgroundImage}
            alt={techImpactContent.backgroundAlt}
            loading="lazy"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
        <div
          style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${colors.black}CC, ${colors.bgDark}F2 55%, ${colors.bgDark})` }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.7rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: `${colors.white}59`
          }}
        >
          ( {techImpactContent.label} )
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            letterSpacing: "-0.02em",
            color: colors.white,
            margin: "0.75rem 0 0.75rem"
          }}
        >
          {techImpactContent.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            ...fonts.montRegular,
            fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
            color: `${colors.white}80`,
            maxWidth: "34rem",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          {techImpactContent.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: "clamp(2.5rem, 5vw, 3.5rem)",
            textAlign: "left",
            background: `linear-gradient(180deg, ${colors.bgDark}E6 0%, ${colors.bgDark}CC 100%)`,
            border: `1px solid ${colors.white}1F`,
            borderRadius: "20px",
            boxShadow: `0 20px 60px ${colors.black}66`,
            padding: "clamp(1.5rem, 3.5vw, 3rem)"
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ ...fonts.montSemiBold, fontSize: sizes.xs, letterSpacing: "0.16em", textTransform: "uppercase", color: `${colors.white}59` }}>
              {headline.label}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.85rem", marginTop: "0.35rem" }}>
            <span style={{ ...fonts.poppinsBold, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: colors.white, letterSpacing: "-0.03em" }}>
              <CountUp value={headline.value} suffix={headline.suffix} />
            </span>
            <span
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.termSuccess,
                border: `1px solid ${colors.termSuccess}40`,
                borderRadius: "100px",
                padding: "0.3rem 0.85rem"
              }}
            >
              {headline.change}
            </span>
          </div>

          <div style={{ height: "clamp(120px, 18vw, 160px)", margin: "clamp(1.5rem, 3vw, 2.5rem) 0 clamp(1.25rem, 2.5vw, 2rem)" }}>
            <ImpactLineChart series={headline.series} />
          </div>

          <div style={{ height: 1, background: `${colors.white}1F`, marginBottom: "clamp(1.5rem, 3vw, 2rem)" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: "clamp(1.5rem, 3vw, 2.5rem)"
            }}
          >
            {techImpactContent.metrics.map((metric, i) => (
              <ImpactMetricColumn key={metric.label} metric={metric} delay={0.1 * i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
