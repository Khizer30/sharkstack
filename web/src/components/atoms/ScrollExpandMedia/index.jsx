import { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ScrollExpandMedia({ videoSrc, title, subtitle }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    let ticking = false;
    const sync = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      setProgress(Math.min(Math.max(scrolled / total, 0), 1));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [isMobile]);

  const firstWord = title.split(" ")[0];
  const rest = title.split(" ").slice(1).join(" ");

  if (isMobile) {
    return (
      <div style={{ padding: "3rem 1.5rem", background: colors.bgDark }}>
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: `0 20px 50px ${colors.black}80`
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="none"
            style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(1.8rem, 8vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: "0 0 0.75rem"
            }}
          >
            <span style={{ color: colors.white }}>{firstWord} </span>
            <span style={{ color: colors.primary }}>{rest}</span>
          </h2>
          {subtitle && (
            <p
              style={{
                ...fonts.poppinsMedium,
                fontSize: "0.9rem",
                color: `${colors.white}6B`,
                lineHeight: 1.7,
                margin: 0
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  const shrink1 = clamp((progress - 0.3) / 0.48, 0, 1);
  const bell = Math.sin(shrink1 * Math.PI);
  const shrink2 = clamp((progress - 0.88) / 0.12, 0, 1);

  const widthVw = 100 - shrink1 * 36 - shrink2 * 22;
  const heightVh = 100 - shrink1 * 36 - shrink2 * 22;
  const br = shrink1 * 22 + shrink2 * 6;
  const rotX = bell * -16 + shrink2 * -10;
  const rotY = bell * 6 + shrink2 * 7;
  const rotZ = shrink2 * 2;
  const cardTopPct = 50 - shrink1 * 11 - shrink2 * 7;
  const shadow = (shrink1 + shrink2) * 70;
  const textRise = shrink2 * 72;

  const exitLinear = clamp((progress - 0.94) / 0.06, 0, 1);
  const exitFade = exitLinear * exitLinear;
  const exitRise = exitFade * 72;
  const textOpacity = clamp((progress - 0.78) / 0.1, 0, 1) * (1 - exitFade);

  return (
    <div ref={containerRef} style={{ height: "380vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: colors.bgDark,
          overflow: "hidden",
          opacity: 1 - exitFade,
          transform: `translateY(${-exitRise}px)`
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${cardTopPct}%`,
            width: `${widthVw}vw`,
            height: `${heightVh}vh`,
            transform: `translate(-50%, -50%) perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
            borderRadius: `${br}px`,
            overflow: "hidden",
            boxShadow: shadow > 0 ? `0 28px ${shadow}px ${colors.black}99` : "none",
            willChange: "transform, width, height"
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="none"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, ${colors.black}26 0%, transparent 40%, ${colors.black}59 100%)`,
              opacity: Math.max(0, 1 - shrink1 * 3),
              pointerEvents: "none"
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "7%",
            left: "50%",
            transform: `translateX(-50%) translateY(${(1 - textOpacity) * 28 - textRise}px)`,
            opacity: textOpacity,
            textAlign: "center",
            width: "90%",
            maxWidth: "52rem",
            pointerEvents: "none"
          }}
        >
          <h2
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(2.2rem, 4.5vw, 5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: "0 0 1rem"
            }}
          >
            <span style={{ color: colors.white }}>{firstWord} </span>
            <span style={{ color: colors.primary }}>{rest}</span>
          </h2>
          {subtitle && (
            <p
              style={{
                ...fonts.poppinsMedium,
                fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)",
                color: `${colors.white}6B`,
                lineHeight: 1.8,
                margin: 0
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
