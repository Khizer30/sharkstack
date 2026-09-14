import { motion } from "motion/react";
import Text from "@/components/atoms/Text";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function StepCard({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 5) * 0.05 } }}
      whileHover={{ y: -8, borderColor: colors.primary, transition: { duration: 0.25, ease: "easeOut" } }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative rounded-2xl flex flex-col justify-between cursor-default"
      style={{
        background: colors.bgDark,
        border: "1px solid transparent",
        padding: "clamp(1.75rem, 4vw, 2.5rem)",
        minHeight: "clamp(13rem, 22vw, 16rem)"
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <Text variant="h2" as="h3" color={colors.white} style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)", letterSpacing: "-0.01em" }}>
          {step.title}
        </Text>
        <motion.span whileHover={{ scale: 1.15 }} style={{ ...fonts.poppinsBold, color: colors.primary, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Text variant="body" as="p" color={`${colors.white}B3`} style={{ marginBottom: "1.25rem", maxWidth: "34rem" }}>
          {step.desc}
        </Text>
        <Text
          as="p"
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.white
          }}
        >
          {step.tag}
        </Text>
      </div>
    </motion.div>
  );
}
