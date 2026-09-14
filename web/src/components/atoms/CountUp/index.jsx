import { motion, animate, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export default function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useMotionValue(0);

  const display = useTransform(count, (v) => {
    const formatted = Number(v.toFixed(decimals)).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, value, duration, count]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
