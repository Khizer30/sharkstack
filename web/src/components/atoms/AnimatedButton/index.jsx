import gsap from "gsap";
import { useRef, useMemo } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const HOVER_OFFSET = 24;
const ANIM_DURATION = 0.35;
const BORDER_SIZE = 1;

export default function AnimatedButton({ text, onClick, size = "default", className = "", style = {} }) {
  const buttonRef = useRef(null);
  const borderRef = useRef(null);
  const primaryTextRef = useRef(null);
  const hoverTextRef = useRef(null);

  const canHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover)").matches;
  }, []);

  const animateHover = (hovered) => {
    if (!canHover) return;
    if (!primaryTextRef.current || !hoverTextRef.current) return;

    gsap.to(primaryTextRef.current, {
      y: hovered ? HOVER_OFFSET : 0,
      opacity: hovered ? 0 : 1,
      duration: ANIM_DURATION,
      ease: "power3.out"
    });

    gsap.to(hoverTextRef.current, {
      y: hovered ? 0 : -HOVER_OFFSET,
      opacity: hovered ? 1 : 0,
      duration: ANIM_DURATION,
      ease: "power3.out"
    });

    if (borderRef.current) {
      gsap.to(borderRef.current, { opacity: hovered ? 1 : 0, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseMove = (e) => {
    if (!buttonRef.current || !borderRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    gsap.to(borderRef.current, {
      "--x": `${e.clientX - rect.left}px`,
      "--y": `${e.clientY - rect.top}px`,
      duration: 0.2,
      ease: "power3.out"
    });
  };

  const sizeStyles = {
    default: { padding: "0.25rem 1rem" },
    medium: { padding: "1rem 1.5rem" }
  };

  const baseStyle = {
    backgroundColor: `${colors.black}66`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${colors.white}26`,
    color: colors.white,
    ...fonts.montMedium,
    fontSize: "0.85rem",
    ...sizeStyles[size],
    ...style
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => animateHover(true)}
      onMouseLeave={() => animateHover(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-sm transition-transform duration-200 active:scale-95 ${className}`}
      style={baseStyle}
    >
      <div
        ref={borderRef}
        className="absolute inset-0 pointer-events-none rounded-md"
        style={{
          padding: BORDER_SIZE,
          borderRadius: "inherit",
          background: `radial-gradient(120px circle at var(--x, 50%) var(--y, 50%), ${colors.primary}, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0
        }}
      />

      <span ref={primaryTextRef} className="relative z-10 whitespace-nowrap">
        {text}
      </span>

      <span
        ref={hoverTextRef}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none whitespace-nowrap"
        style={{ opacity: 0, transform: `translateY(-${HOVER_OFFSET}px)` }}
      >
        {text}
      </span>
    </button>
  );
}
