import gsap from "gsap";
import { forwardRef, useRef, useEffect } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function SocialMenuLinksBox({ links = [], activeLink, onLinkClick }) {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || linksRef.current.length === 0) return;

    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    linksRef.current.forEach((linkRef) => {
      if (!linkRef) return;
      const textEl = linkRef.querySelector("h2");
      if (textEl) gsap.set(textEl, { opacity: 0, filter: "blur(20px)", y: -10 });
    });

    linksRef.current.forEach((linkRef, index) => {
      if (!linkRef) return;
      const textEl = linkRef.querySelector("h2");
      if (!textEl) return;

      timelineRef.current.to(textEl, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.2, ease: "power2.out" }, index * 0.2);
    });

    return () => timelineRef.current?.kill();
  }, [links]);

  return (
    <div ref={containerRef} className="space-y-2 md:space-y-3">
      {links.map((link, index) => (
        <MenuLink
          key={link}
          text={link}
          isActive={link === activeLink}
          ref={(el) => {
            linksRef.current[index] = el;
          }}
          onClick={() => onLinkClick?.(link)}
        />
      ))}
    </div>
  );
}

const MenuLink = forwardRef(function MenuLink({ text, isActive, onClick }, ref) {
  const textRef = useRef(null);
  const bulletRef = useRef(null);
  const hoverTimelineRef = useRef(null);

  const handleHover = () => {
    hoverTimelineRef.current?.kill();
    hoverTimelineRef.current = gsap.timeline();

    hoverTimelineRef.current.to(textRef.current, { x: 20, scale: 1.03, duration: 0.6, ease: "power3.out" });

    hoverTimelineRef.current.fromTo(
      bulletRef.current,
      { opacity: 0, x: -40, scale: 0, rotation: -180, filter: "blur(10px)" },
      { opacity: 1, x: 0, scale: 1, rotation: 0, filter: "blur(0px)", duration: 0.8, ease: "back.out(2)" },
      0
    );
  };

  const handleLeave = () => {
    hoverTimelineRef.current?.kill();
    hoverTimelineRef.current = gsap.timeline();

    hoverTimelineRef.current.to(textRef.current, { x: 0, scale: 1, duration: 0.6, ease: "power3.out" });

    hoverTimelineRef.current.to(bulletRef.current, { opacity: 0, x: -40, scale: 0.8, rotation: 45, filter: "blur(10px)", duration: 0.5, ease: "power2.in" }, 0);
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className="cursor-pointer flex items-center group"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span
        ref={bulletRef}
        className="text-sm md:text-base opacity-0 mr-2 md:mr-3 relative"
        style={{
          color: colors.primary,
          willChange: "transform, opacity, filter",
          transform: "translateX(-40px) scale(0)",
          filter: "blur(10px)"
        }}
      >
        ✦
      </span>

      <h2
        ref={textRef}
        className="text-3xl md:text-4xl lg:text-5xl relative"
        style={{
          ...fonts.poppinsBold,
          color: isActive ? colors.primary : colors.white,
          willChange: "transform, opacity, filter",
          transform: "translateY(-10px)",
          opacity: 0,
          filter: "blur(20px)"
        }}
      >
        {text}
      </h2>
    </div>
  );
});

MenuLink.displayName = "MenuLink";
