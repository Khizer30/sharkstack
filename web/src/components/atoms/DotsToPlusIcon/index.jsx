import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { colors } from "@/constants/colors";

export default function DotsToPlusIcon({ onClick }) {
  const containerRef = useRef(null);
  const verticalDotsRef = useRef(null);
  const horizontalDotsRef = useRef(null);
  const centerThreeDotsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMobileTap = () => {
    if (!isMobile) return;

    const isOpen = containerRef.current?.getAttribute("data-state") === "open";

    if (isOpen) {
      animateToDots();
      containerRef.current?.setAttribute("data-state", "closed");
    } else {
      animateToPlus();
      containerRef.current?.setAttribute("data-state", "open");
    }

    onClick?.();
  };

  const handleDesktopClick = () => {
    if (isMobile) return;
    onClick?.();
  };

  const animateToPlus = () => {
    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(centerThreeDotsRef.current, { rotation: 90, duration: duration * 0.6, ease });
    gsap.to(centerThreeDotsRef.current, { opacity: 0, scale: 0, duration: duration * 0.4, delay: duration * 0.3, ease });
    gsap.to(verticalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease });
    gsap.to(horizontalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease });
  };

  const animateToDots = () => {
    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(verticalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease });
    gsap.to(horizontalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease });
    gsap.to(centerThreeDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.1, ease });
    gsap.to(centerThreeDotsRef.current, { rotation: 0, duration: duration * 0.6, delay: duration * 0.1, ease });
  };

  const normalDotSize = "w-1 h-1";
  const hoverDotSize = "w-0.75 h-0.75";
  const gapClass = "gap-1";
  const containerSize = "w-6 h-6";

  return (
    <div
      ref={containerRef}
      className={`relative ${containerSize} flex items-center justify-center`}
      onMouseEnter={!isMobile ? animateToPlus : undefined}
      onMouseLeave={!isMobile ? animateToDots : undefined}
      onClick={isMobile ? handleMobileTap : handleDesktopClick}
      data-state="closed"
    >
      <div ref={centerThreeDotsRef} className={`absolute flex items-center ${gapClass}`} style={{ transform: "rotate(0deg)" }}>
        <div className={`${normalDotSize} rounded-full`} style={{ backgroundColor: colors.white }} />
        <div className={`${normalDotSize} rounded-full`} style={{ backgroundColor: colors.white }} />
        <div className={`${normalDotSize} rounded-full`} style={{ backgroundColor: colors.white }} />
      </div>

      <div ref={verticalDotsRef} className="absolute flex flex-col items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {[...Array(5)].map((_, i) => (
          <div key={`v-${i}`} className={`${hoverDotSize} rounded-full`} style={{ backgroundColor: colors.white }} />
        ))}
      </div>

      <div ref={horizontalDotsRef} className="absolute flex items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {[...Array(5)].map((_, i) => (
          <div key={`h-${i}`} className={`${hoverDotSize} rounded-full`} style={{ backgroundColor: colors.white }} />
        ))}
      </div>
    </div>
  );
}
