import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { colors } from "@/constants/colors";

export default function NavPillBox({ children, className = "", onClick }) {
  const boxRef = useRef(null);
  const borderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile || !borderRef.current) return;
    gsap.to(borderRef.current, { opacity: 1, duration: 0.35, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (isMobile || !borderRef.current) return;
    gsap.to(borderRef.current, { opacity: 0, duration: 0.35, ease: "power3.out" });
  };

  const handleMouseMove = (e) => {
    if (isMobile || !boxRef.current || !borderRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    gsap.to(borderRef.current, {
      "--x": `${e.clientX - rect.left}px`,
      "--y": `${e.clientY - rect.top}px`,
      duration: 0.2,
      ease: "power3.out"
    });
  };

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden h-9 md:h-10 flex items-center backdrop-blur-lg transition-all duration-300 ${className}`}
      style={{ backgroundColor: `${colors.bgBrand}66` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {!isMobile && (
        <div
          ref={borderRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            padding: 1,
            background: `radial-gradient(120px circle at var(--x, 50%) var(--y, 50%), ${colors.primary}, transparent 70%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0
          }}
        />
      )}

      <div className="absolute inset-0 pointer-events-none" style={{ border: `1px solid ${colors.white}26` }} />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
