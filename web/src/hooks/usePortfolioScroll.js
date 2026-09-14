import { useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent } from "motion/react";
import { useRef, useEffect } from "react";

export const CARD_ASPECT = 292 / 520;
export const CARD_GAP = 28;

const LOOPS = 12;

export function getCardIntroPos(i, n) {
  const t = n > 1 ? i / (n - 1) : 0;
  return {
    stackX: Math.sin(i * 1.2) * 80 + (i - n / 2) * 14,
    stackY: (i - n / 2) * 18 + Math.cos(i * 0.8) * 25,
    stackRot: (i - n / 2) * 7.5,
    zigzagX: (i - (n - 1) / 2) * 58,
    zigzagY: Math.sin(t * Math.PI * 2) * 90,
    zigzagRot: (t - 0.5) * 20
  };
}

export function usePortfolioScroll(numItems, onActiveChange) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const itemStepMV = useMotionValue(280);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, numItems * LOOPS]);
  const activeProgress = useSpring(rawProgress, { stiffness: 42, damping: 15, mass: 1.1 });

  useMotionValueEvent(rawProgress, "change", (v) => {
    onActiveChange?.(Math.floor(v) % numItems);
  });

  useEffect(() => {
    const compute = () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;
      const cardW = Math.min(520, Math.max(240, section.clientWidth * 0.76));
      itemStepMV.set(cardW * CARD_ASPECT + CARD_GAP);
      container.style.height = `${numItems * LOOPS * 100}vh`;
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [numItems]);

  return { containerRef, sectionRef, activeProgress, itemStepMV };
}
