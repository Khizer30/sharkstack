import { useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { colors } from "@/constants/colors";

const BARS = [
  4, 7, 14, 9, 18, 6, 13, 10, 20, 8, 4, 16, 11, 17, 6, 13, 9, 19, 7, 4, 15, 10, 18, 6, 13, 8, 17, 5, 14, 10, 4, 16, 12, 20, 7, 14, 9, 17, 6, 15, 10, 4, 13, 8,
  19, 7, 15, 11, 18, 5, 14, 9, 17, 4, 13, 8, 15, 7, 18, 10, 5, 16, 12, 19, 8, 13, 9, 16, 4, 14, 10, 18, 6, 15, 11, 19, 7, 13, 9, 16
];

export default function TestimonialsScrollTracker({ progressMV }) {
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(progressMV, "change", (v) => {
    setProgress(Math.max(0, Math.min(1, v)));
  });

  const activeCount = Math.round(progress * BARS.length);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: "24px",
        padding: "0 clamp(2rem, 6vw, 6rem)",
        boxSizing: "border-box"
      }}
    >
      {BARS.map((h, i) => (
        <div
          key={i}
          style={{
            width: "1.5px",
            flexShrink: 0,
            height: h,
            borderRadius: 1,
            backgroundColor: i < activeCount ? colors.white : `${colors.white}22`,
            transition: "background-color 0.12s ease"
          }}
        />
      ))}
    </div>
  );
}
