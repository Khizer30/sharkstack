import { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/colors";
import { processContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const { words, label } = processContent;

export default function CyclingWords() {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const wordRefs = useRef([]);

  // background-attachment: fixed (the desktop highlight trick in styles.js)
  // is unreliable on mobile browsers, so the active word crossing the
  // viewport's center is tracked directly instead.
  useEffect(() => {
    if (!isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = wordRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    wordRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <header className="ps-header" aria-label="Our process">
      <div className="ps-header-inner">
        <h2 className="ps-label" aria-hidden="true">
          {label.toLowerCase()}&nbsp;
        </h2>
        <ul className="ps-words" aria-label={`Our process: ${label} ${words.join(` ${label} `)}`}>
          {words.map((word, i) => (
            <li
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={isMobile ? undefined : "ps-word"}
              aria-hidden="true"
              style={isMobile ? { color: i === activeIndex ? colors.primary : "rgba(255,255,255,0.28)" } : undefined}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
