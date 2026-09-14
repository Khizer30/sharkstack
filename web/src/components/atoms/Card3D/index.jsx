import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { useState, useEffect } from "react";

const SPRING = { stiffness: 160, damping: 18, mass: 0.9 };

export default function Card3D({ children, enabled = true, maxTilt = 18, perspective = 900, style, innerStyle }) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, SPRING);
  const springY = useSpring(tiltY, SPRING);

  const shadowX = useTransform(springY, (v) => -v * 2);
  const shadowY = useTransform(springX, (v) => v * 2);
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.28)`;

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled) {
      tiltX.set(0);
      tiltY.set(0);
      setIsHovering(false);
    }
  }, [enabled]);

  const onMouseMove = (e) => {
    if (!enabled) return;
    if (!isHovering) setIsHovering(true);
    const r = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    tiltX.set((cy - 0.5) * -maxTilt);
    tiltY.set((cx - 0.5) * maxTilt);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ width: "100%", height: "100%", ...style }}>
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformPerspective: perspective,
          boxShadow: shadow,
          width: "100%",
          height: "100%",
          willChange: "transform",
          ...innerStyle
        }}
      >
        {typeof children === "function" ? children({ isHovering }) : children}
      </motion.div>
    </div>
  );
}
