import gsap from "gsap";
import { useEffect, useRef } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function TextTicker({ items, speed = 32, textColor = colors.gray800, markColor = colors.primary, scrollLinked = false, sensitivity = 3 }) {
  const doubled = [...items, ...items];
  const trackRef = useRef(null);

  useEffect(() => {
    if (!scrollLinked) return;
    const track = trackRef.current;
    if (!track) return;

    let lastY = window.scrollY;
    let x = 0;
    const setX = gsap.quickSetter(track, "x", "px");

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      lastY = currentY;

      const half = track.scrollWidth / 2;
      if (half <= 0) return;

      x += delta * sensitivity;
      let wrapped = x % half;
      if (wrapped > 0) wrapped -= half;
      setX(wrapped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollLinked, sensitivity]);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "baseline",
          width: "max-content",
          animation: scrollLinked ? "none" : `footer-marquee ${speed}s linear infinite`
        }}
      >
        {doubled.map((item, i) => {
          const isMark = item === "✦";
          return (
            <span
              key={i}
              style={{
                ...fonts.poppinsMedium,
                fontSize: isMark ? "clamp(1.5rem, 4vw, 3.5rem)" : "clamp(3rem, 9vw, 8rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                textTransform: isMark ? "none" : "lowercase",
                color: isMark ? markColor : textColor,
                padding: "0 1.25rem",
                whiteSpace: "nowrap"
              }}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
