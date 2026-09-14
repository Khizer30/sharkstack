import { motion, useTransform } from "motion/react";
import { colors } from "@/constants/colors";

export default function TimelineDot({ progress, threshold }) {
  const fillOpacity = useTransform(progress, [Math.max(threshold - 0.1, 0), threshold], [0, 1]);

  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: `${threshold * 100}%`,
        transform: "translate(-50%, -50%)",
        width: "0.9rem",
        height: "0.9rem"
      }}
    >
      <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${colors.black}`, background: colors.bgLight }} />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: colors.black, opacity: fillOpacity, boxShadow: `0 0 10px ${colors.black}A0` }}
      />
    </div>
  );
}
