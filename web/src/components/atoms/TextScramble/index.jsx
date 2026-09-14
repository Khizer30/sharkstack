import { useState, useCallback, useRef, useEffect } from "react";
import { colors } from "@/constants/colors";

const CHARS = "ABCDEFGHIJKLMNOPYZ0129!@#$%&*";

export default function TextScramble({ text, style, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    setIsScrambling(true);
    frameRef.current = 0;
    const duration = text.length * 3;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / duration;
      const revealedLen = Math.floor(progress * text.length);

      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealedLen) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (frameRef.current >= duration) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [text]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div
      className={`group relative inline-flex flex-col cursor-pointer select-none ${className}`}
      style={style}
      onMouseEnter={() => {
        setIsHovering(true);
        scramble();
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              transition: "color 150ms, transform 150ms",
              transitionDelay: `${i * 10}ms`,
              color: isScrambling && char !== text[i] ? colors.primary : "inherit",
              transform: isScrambling && char !== text[i] ? "scale(1.1)" : "scale(1)"
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* underline */}
      <span style={{ position: "relative", height: "1px", width: "100%", marginTop: "0.5rem", overflow: "hidden" }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "currentColor",
            transformOrigin: "left",
            transform: isHovering ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 500ms ease-out"
          }}
        />
        <span style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.15)" }} />
      </span>

      {/* glow */}
      <span
        style={{
          position: "absolute",
          inset: "-1rem",
          borderRadius: "0.5rem",
          backgroundColor: `${colors.primary}0D`,
          opacity: isHovering ? 1 : 0,
          transition: "opacity 300ms",
          zIndex: -1,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}
