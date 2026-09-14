import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";
import EyebrowLabel from "@/components/atoms/EyebrowLabel";
import ScrollFillLine from "@/components/atoms/ScrollFillLine";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function SteppedTextReveal({ label, steps, staticBg, staticTextColor }) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const { scrollYProgress: raw } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const progress = useSpring(raw, { stiffness: 60, damping: 22, restDelta: 0.001 });

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setIndex(next);
  });

  return (
    <div ref={containerRef} style={{ height: `${steps.length * 100}vh`, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: staticBg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(2rem, 6vw, 7rem)",
            width: "100%"
          }}
        >
          <EyebrowLabel label={label} style={{ marginBottom: "1rem" }} />

          <ScrollFillLine progress={progress} trackColor={`${staticTextColor}1A`} style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              gap: "clamp(2rem, 4vw, 5rem)",
              alignItems: "start"
            }}
          >
            <div
              style={{
                ...fonts.montMedium,
                fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)",
                letterSpacing: "0.05em",
                color: colors.gray400,
                paddingTop: "0.5rem"
              }}
            >
              {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </div>

            <div className="stepped-text-wrapper">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  className="stepped-text-p"
                  initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -32, filter: "blur(6px)" }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    margin: 0,
                    ...fonts.poppinsMedium,
                    fontSize: "clamp(1.5rem, 3vw, 3rem)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    color: staticTextColor
                  }}
                >
                  {steps[index]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
