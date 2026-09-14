import { motion } from "motion/react";
import { colors } from "@/constants/colors";

export default function Spinner({ size = 18, color = colors.primary, thickness = 2 }) {
  return (
    <motion.span
      aria-label="Loading"
      role="status"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${thickness}px solid ${color}30`,
        borderTopColor: color,
        boxSizing: "border-box"
      }}
    />
  );
}
