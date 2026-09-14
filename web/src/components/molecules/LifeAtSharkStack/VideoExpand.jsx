import { useEffect, useRef, useState } from "react";
import video_2Mp4 from "@/assets/animations/video_2.mp4";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function VideoExpand() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const computeProgress = () => {
      rafRef.current = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.min(Math.max(scrolled / total, 0), 1));
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(computeProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    computeProgress();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  // Only decode/play the video while it's actually on screen — otherwise it
  // keeps running in the background for the rest of the session.
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

  const w = 280 + progress * 1300;
  const h = 160 + progress * 420;
  const br = Math.max(0, 18 * (1 - progress));
  const shadow = 80 * (1 - progress);

  if (isMobile) {
    return (
      <div style={{ padding: "3rem 1.5rem", background: colors.white }}>
        <div
          style={{
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: `0 10px 40px ${colors.black}30`
          }}
        >
          <video
            ref={videoRef}
            src={video_2Mp4}
            muted
            loop
            playsInline
            preload="none"
            style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "280vh", position: "relative", background: colors.white }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${w}px`,
            height: `${h}px`,
            maxWidth: "98vw",
            maxHeight: "95vh",
            borderRadius: `${br}px`,
            overflow: "hidden",
            boxShadow: `0 0 ${shadow}px ${colors.black}70`,
            transition: "box-shadow 0.05s linear"
          }}
        >
          <video
            ref={videoRef}
            src={video_2Mp4}
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
              background: colors.black,
              opacity: Math.max(0, 0.45 - progress * 0.45),
              pointerEvents: "none"
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "7%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: Math.max(0, 1 - progress * 3),
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          <span
            style={{
              ...fonts.montMedium,
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: `${colors.black}40`
            }}
          >
            Scroll to watch
          </span>
        </div>
      </div>
    </div>
  );
}
