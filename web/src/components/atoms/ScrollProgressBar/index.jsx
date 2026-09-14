import { motion } from "motion/react";
import { colors } from "@/constants/colors";

export default function ScrollProgressBar({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "2px",
        background: `${colors.black}08`,
        zIndex: 200,
        pointerEvents: "none"
      }}
    >
      <motion.div
        style={{
          height: progress,
          background: `linear-gradient(to bottom, ${colors.primary}, ${colors.primary}80)`,
          width: "100%"
        }}
      />
    </div>
  );
}
