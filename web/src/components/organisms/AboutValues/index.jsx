import { useState, useRef, useCallback, useEffect } from "react";
import EyebrowLabel from "@/components/atoms/EyebrowLabel";
import CursorImage from "@/components/molecules/AboutValues/CursorImage";
import ValueRow from "@/components/molecules/AboutValues/ValueRow";
import { aboutValuesContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AboutValues() {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const prevCursor = useRef({ x: 0, y: 0 });
  const rowRefs = useRef([]);

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - prevCursor.current.x;
    const dy = e.clientY - prevCursor.current.y;
    const ease = 0.2;
    const nextX = prevCursor.current.x + dx * ease;
    const nextY = prevCursor.current.y + dy * ease;
    setCursor({ x: nextX, y: nextY });
    prevCursor.current = { x: nextX, y: nextY };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateCursorPosition = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", updateCursorPosition);
    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, handleMouseMove]);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const handleEnter = (i) => {
    setActiveIndex(i);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, 50);
  };

  const handleLeave = () => {
    setActiveIndex(null);
    setOpacity(0);
    setScale(0.5);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const values = aboutValuesContent.values;
  const active = activeIndex !== null ? values[activeIndex] : null;

  return (
    <section
      className="relative w-full"
      style={{ background: "transparent", padding: "clamp(6rem, 10vw, 8rem) clamp(2rem, 6vw, 7rem)" }}
      onMouseLeave={handleLeave}
    >
      <EyebrowLabel label={aboutValuesContent.eyebrow} className="mb-8" />

      <div className="w-full mt-8 md:mt-0">
        {values.map((value, i) => (
          <ValueRow
            key={value.title}
            value={value}
            index={i}
            isActive={i === activeIndex}
            isMobile={isMobile}
            rowRef={(el) => {
              rowRefs.current[i] = el;
            }}
            onMouseEnter={() => handleEnter(i)}
          />
        ))}
      </div>

      {!isMobile && <CursorImage active={active} cursor={cursor} opacity={opacity} scale={scale} />}
    </section>
  );
}
