import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function CubeLink({ children, onClick }) {
  const cubeRef = useRef(null);
  const frontRef = useRef(null);
  const topRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const animateCube = (isEntering) => {
    if (isMobile) return;
    if (!cubeRef.current || !frontRef.current || !topRef.current) return;

    gsap.killTweensOf([cubeRef.current, frontRef.current, topRef.current]);

    const tl = gsap.timeline();
    const duration = 0.25;
    const ease = "power2.out";

    if (isEntering) {
      tl.to(cubeRef.current, { rotateX: -90, duration, ease })
        .to(topRef.current, { opacity: 1, y: 0, duration: 0.15, ease }, 0.05)
        .to(frontRef.current, { opacity: 0, y: 5, duration: 0.15, ease }, 0);
    } else {
      tl.to(cubeRef.current, { rotateX: 0, duration, ease })
        .to(topRef.current, { opacity: 0, y: -10, duration: 0.15, ease }, 0)
        .to(frontRef.current, { opacity: 1, y: 0, duration: 0.15, ease }, 0.05);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative w-16 h-6 overflow-hidden cursor-pointer perspective-500"
      onMouseEnter={() => animateCube(true)}
      onMouseLeave={() => animateCube(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div ref={cubeRef} className="relative w-full h-full preserve-3d" style={{ transformStyle: "preserve-3d", transformOrigin: "center center -10px" }}>
        <span
          ref={frontRef}
          className="absolute inset-0 flex items-center justify-center backface-hidden"
          style={{ ...fonts.montMedium, fontSize: "0.875rem", color: colors.white, transform: "translateZ(10px)" }}
        >
          {children}
        </span>

        <span
          ref={topRef}
          className="absolute inset-0 flex items-center justify-center backface-hidden"
          style={{
            ...fonts.montMedium,
            fontSize: "0.875rem",
            color: colors.white,
            opacity: 0,
            transform: "rotateX(90deg) translateZ(10px)",
            transformOrigin: "bottom center"
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
