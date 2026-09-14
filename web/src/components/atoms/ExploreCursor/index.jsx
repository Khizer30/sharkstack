import { useMotionValue, useSpring, useTransform, useMotionValueEvent, motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import ArrowUpRightIcon from "./ArrowUpRightIcon";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const wordVariants = {
  hidden: () => ({ y: 10, opacity: 0, filter: "blur(4px)" }),
  visible: (i) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.07 + 0.1, type: "spring", stiffness: 280, damping: 24 }
  }),
  exit: { y: -6, opacity: 0, filter: "blur(4px)", transition: { duration: 0.1 } }
};

export function useExploreCursor({ label = "View Project", bg = colors.black, color = colors.white, size = 130 } = {}) {
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const x = useSpring(rawX, { stiffness: 130, damping: 26, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 130, damping: 26, mass: 0.8 });
  const scaleRaw = useMotionValue(0);
  const scale = useSpring(scaleRaw, { stiffness: 350, damping: 18, mass: 0.5 });

  const [active, setActive] = useState(false);
  useMotionValueEvent(scale, "change", (v) => setActive(v > 0.4));

  const half = size / 2;
  const xT = useTransform(x, (v) => v - half);
  const yT = useTransform(y, (v) => v - half);
  const opacity = useTransform(scale, [0, 0.15], [0, 1]);

  const handlers = {
    onMouseMove: (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    },
    onMouseEnter: () => scaleRaw.set(1),
    onMouseLeave: () => {
      scaleRaw.set(0);
      rawX.set(-9999);
      rawY.set(-9999);
    }
  };

  const words = label.split(" ");

  const element = (
    <motion.div className="pointer-events-none fixed left-0 top-0" style={{ x: xT, y: yT, scale, opacity, zIndex: 9999 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.06em",
          overflow: "hidden"
        }}
      >
        <AnimatePresence>
          {active &&
            words.map((word, i) => {
              const isLast = i === words.length - 1;
              return (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2em",
                    ...fonts.poppinsBold,
                    fontSize: "0.88rem",
                    color,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    lineHeight: 1.1
                  }}
                >
                  {word}
                  {isLast && <ArrowUpRightIcon size={18} color={color} />}
                </motion.span>
              );
            })}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return { handlers, element };
}
