import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

function buildSegments(line1, accent, line2) {
  const segments = [];
  let idx = 0;
  line1
    .split(" ")
    .filter(Boolean)
    .forEach((w) => segments.push({ type: "word", w, color: colors.white, idx: idx++ }));
  segments.push({ type: "br" });
  accent
    .split(" ")
    .filter(Boolean)
    .forEach((w) => segments.push({ type: "word", w, color: colors.primary, idx: idx++ }));
  line2
    .trim()
    .split(" ")
    .filter(Boolean)
    .forEach((w) => segments.push({ type: "word", w, color: colors.white, idx: idx++ }));
  return segments;
}

export default function PhraseText({ line1, accent, line2 }) {
  const segments = buildSegments(line1, accent, line2);

  return (
    <h2
      style={{
        ...fonts.poppinsBold,
        fontSize: "clamp(2.5rem, 5vw, 6rem)",
        lineHeight: 1.15,
        letterSpacing: "-0.03em",
        margin: 0
      }}
    >
      {segments.map((seg, i) => {
        if (seg.type === "br") return <br key={i} />;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.28em" }}>
            <motion.span
              style={{ display: "inline-block", color: seg.color }}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: seg.idx * 0.055
              }}
            >
              {seg.w}
            </motion.span>
          </span>
        );
      })}
    </h2>
  );
}
