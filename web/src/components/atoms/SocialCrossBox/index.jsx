import gsap from "gsap";
import { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import { colors } from "@/constants/colors";

const SocialCrossBox = forwardRef(function SocialCrossBox({ onHover, onLeave, onClose }, ref) {
  const bgRef = useRef(null);
  const crossContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = useCallback(() => {
    if (isClosing || !onClose) return;

    setIsClosing(true);

    if (crossContainerRef.current && bgRef.current) {
      const tl = gsap.timeline({ onComplete: () => onClose() });

      tl.to(crossContainerRef.current, { scale: 0.8, opacity: 0.7, duration: 0.2, ease: "power2.out" }).to(crossContainerRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      });

      tl.to(bgRef.current, { backgroundColor: colors.white, duration: 0.3 }, "-=0.2");
    } else {
      onClose();
    }
  }, [isClosing, onClose]);

  const handleMouseEnter = () => {
    if (isMobile || isClosing) return;
    setIsHovered(true);
    if (bgRef.current) gsap.to(bgRef.current, { backgroundColor: colors.white, duration: 0.4, ease: "power2.out" });
    onHover?.();
  };

  const handleMouseLeave = () => {
    if (isMobile || isClosing) return;
    setIsHovered(false);
    if (bgRef.current) gsap.to(bgRef.current, { backgroundColor: `${colors.black}66`, duration: 0.4, ease: "power2.out" });
    onLeave?.();
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="overflow-hidden transition-all duration-500 flex items-center justify-center cursor-pointer group"
      style={{ height: "150px", backgroundColor: `${colors.black}66` }}
    >
      <div ref={bgRef} className="w-full h-full flex items-center justify-center relative" style={{ backgroundColor: `${colors.black}66` }}>
        {isMobile && !isClosing && (
          <div
            className="absolute bottom-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ color: `${colors.white}99` }}
          >
            Tap to close
          </div>
        )}

        <div
          ref={crossContainerRef}
          className={`relative w-12 h-12 flex items-center justify-center transition-all duration-300 ${isClosing ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
        >
          <CrossIcon isMobile={isMobile} isHovered={isHovered} isClosing={isClosing} />
        </div>
      </div>
    </div>
  );
});

SocialCrossBox.displayName = "SocialCrossBox";

function CrossIcon({ isMobile, isHovered, isClosing = false }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {!isMobile && !isHovered && !isClosing && (
        <div className="absolute flex items-center gap-[4px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: colors.white }} />
          ))}
        </div>
      )}

      <div
        className="absolute transition-all duration-500"
        style={{
          opacity: isMobile || isHovered || isClosing ? 1 : 0,
          transform: isClosing ? "scale(0.8) rotate(45deg)" : "scale(1)"
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[-8, -4, 0, 4, 8].map((offset) => (
            <div
              key={`diag1-${offset}`}
              className="w-[3px] h-[3px] rounded-full absolute transition-colors duration-300"
              style={{
                top: `${offset}px`,
                left: `${offset}px`,
                backgroundColor: isMobile ? colors.white : isHovered || isClosing ? colors.black : colors.white
              }}
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[-8, -4, 0, 4, 8].map((offset) => (
            <div
              key={`diag2-${offset}`}
              className="w-[3px] h-[3px] rounded-full absolute transition-colors duration-300"
              style={{
                top: `${offset}px`,
                left: `${-offset}px`,
                backgroundColor: isMobile ? colors.white : isHovered || isClosing ? colors.black : colors.white
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SocialCrossBox;
