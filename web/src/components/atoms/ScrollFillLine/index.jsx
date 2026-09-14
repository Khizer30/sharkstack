import { motion } from "motion/react";
import { colors } from "@/constants/colors";

export default function ScrollFillLine({ progress, trackColor, style }) {
  return (
    <div style={{ position: "relative", height: "1px", background: trackColor ?? `${colors.white}1A`, ...style }}>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: colors.primary,
          transformOrigin: "left",
          scaleX: progress
        }}
      />
    </div>
  );
}
