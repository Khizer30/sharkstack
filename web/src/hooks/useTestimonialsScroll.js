import { useMotionValue, useSpring, useScroll, useMotionValueEvent } from "motion/react";
import { useRef, useEffect } from "react";

const X_START = 0.3;

export function useTestimonialsScroll(deps = []) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const maxScrollRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawX = useMotionValue(0);
  const trackX = useSpring(rawX, { stiffness: 85, damping: 24, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const xProg = v <= X_START ? 0 : (v - X_START) / (1 - X_START);
    rawX.set(-xProg * maxScrollRef.current);
  });

  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!track || !section || !container) return;

      const drag = Math.max(0, track.scrollWidth - section.clientWidth);
      maxScrollRef.current = drag;
      container.style.height = `calc(100vh + ${drag}px + 40vh)`;

      const v = scrollYProgress.get();
      const xProg = v <= X_START ? 0 : (v - X_START) / (1 - X_START);
      rawX.set(-xProg * drag);
    };

    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, sectionRef, trackRef, scrollYProgress, trackX };
}
