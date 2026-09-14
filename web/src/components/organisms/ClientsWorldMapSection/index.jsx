import { motion } from "motion/react";
import WorldMap from "@/components/atoms/WorldMap";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { clientsWorldMapContent } from "@/content";

export default function ClientsWorldMapSection() {
  return (
    <section
      style={{
        background: colors.bgBrand,
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
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
            color: `${colors.white}80`
          }}
        >
          ( {clientsWorldMapContent.label} )
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
          {clientsWorldMapContent.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            ...fonts.montRegular,
            fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
            color: `${colors.white}CC`,
            maxWidth: "34rem",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          {clientsWorldMapContent.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: "clamp(2.5rem, 5vw, 3.5rem)",
            background: `${colors.black}26`,
            border: `1px solid ${colors.white}14`,
            borderRadius: "24px",
            padding: "clamp(1rem, 3vw, 2.25rem)",
            boxShadow: `0 30px 80px ${colors.black}59`
          }}
        >
          <WorldMap dots={clientsWorldMapContent.dots} />
        </motion.div>
      </div>
    </section>
  );
}
