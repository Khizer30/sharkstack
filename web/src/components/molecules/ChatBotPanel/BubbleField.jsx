import { motion } from "motion/react";
import { colors } from "@/constants/colors";

const BUBBLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: 6 + Math.random() * 88,
  size: 4 + Math.random() * 9,
  duration: 6 + Math.random() * 6,
  delay: Math.random() * 6
}));

export default function BubbleField() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {BUBBLES.map((b) => (
        <motion.span
          key={b.id}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            border: `1px solid ${colors.black}55`,
            background: `${colors.black}0F`
          }}
        />
      ))}
    </div>
  );
}
