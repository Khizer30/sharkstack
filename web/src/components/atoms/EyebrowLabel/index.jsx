import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function EyebrowLabel({ label, opacity = 1, className, style }) {
  return (
    <motion.span
      className={className}
      style={{
        ...fonts.montSemiBold,
        fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)",
        letterSpacing: "0.12em",
        color: colors.gray800,
        display: "block",
        whiteSpace: "nowrap",
        opacity,
        ...style
      }}
    >
      ( {label} )
    </motion.span>
  );
}
