import { useState, useRef, useEffect } from "react";
import { colors } from "@/constants/colors";
import { useShowreelVideo } from "@/hooks/useShowreelVideo";

export default function ShowreelCard() {
  const showreelVideoUrl = useShowreelVideo();
  const [isMobile, setIsMobile] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 800);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const max = 20;
    const strength = 0.025;
    const ease = 0.08;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      target.current = {
        x: Math.max(-max, Math.min(max, relX * strength)),
        y: Math.max(-max, Math.min(max, relY * strength))
      };
    };

    const tick = () => {
      const dx = target.current.x - prev.current.x;
      const dy = target.current.y - prev.current.y;
      const nextX = prev.current.x + dx * ease;
      const nextY = prev.current.y + dy * ease;
      prev.current = { x: nextX, y: nextY };
      setOffset({ x: nextX, y: nextY });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ width: "100%", aspectRatio: "16 / 9", background: colors.primary }}>
      <video
        src={showreelVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: isMobile ? "none" : `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.12)`,
          willChange: "transform"
        }}
      />
    </div>
  );
}
