import { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const DEFAULT_FONT = `${fonts.poppinsBold.fontWeight} {size}px ${fonts.poppinsBold.fontFamily}`;

export default function TextParticle({ text, fontSize = 120, particleSize = 2, particleColor = colors.white, particleDensity = 5, className = "" }) {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: null, y: null });
  const animationRef = useRef(null);
  const rectRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initText = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      rectRef.current = canvas.getBoundingClientRect();

      // Sample the text mask on a throwaway offscreen canvas so the
      // `willReadFrequently` hint (which forces CPU rendering) never
      // touches the visible canvas used for the continuous animation.
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      // Auto-fit: scale down if text overflows canvas width
      let size = fontSize;
      const fontString = (s) => DEFAULT_FONT.replace("{size}", s);
      offCtx.font = fontString(size);
      const measured = offCtx.measureText(text).width;
      if (measured > canvas.width * 0.9) {
        size = Math.floor(size * ((canvas.width * 0.9) / measured));
      }

      offCtx.font = fontString(size);
      offCtx.fillStyle = "black";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, canvas.width / 2, canvas.height / 2);

      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const newParticles = [];

      for (let y = 0; y < imageData.height; y += particleDensity) {
        for (let x = 0; x < imageData.width; x += particleDensity) {
          if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
            newParticles.push({
              x,
              y,
              baseX: x,
              baseY: y,
              size: particleSize
            });
          }
        }
      }

      setParticles(newParticles);
    };

    let cancelled = false;
    const start = () => {
      if (!cancelled) initText();
    };

    const fontLoadString = DEFAULT_FONT.replace("{size}", fontSize);
    if (document.fonts?.load) {
      document.fonts.load(fontLoadString, text).then(start, start);
    } else {
      start();
    }

    window.addEventListener("resize", initText);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", initText);
    };
  }, [text, fontSize, particleSize, particleDensity]);

  useEffect(() => {
    if (particles.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isVisible = true;

    const animate = () => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = particleColor;
      ctx.beginPath();

      particles.forEach((p) => {
        let forceX = 0,
          forceY = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000) {
            const dist = Math.sqrt(distSq);
            forceX = (dx / dist) * 3;
            forceY = (dy / dist) * 3;
          }
        }

        p.x += forceX + (p.baseX - p.x) * 0.05;
        p.y += forceY + (p.baseY - p.y) * 0.05;

        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      });

      ctx.fill();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Stop the per-particle physics + redraw loop entirely once this
    // scrolls off screen — otherwise it keeps costing a frame forever,
    // for the rest of the session, on every page that mounts it.
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationRef.current) animate();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, particleColor]);

  const handleMouseMove = (e) => {
    const rect = rectRef.current;
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseRef.current = { x: null, y: null };
      }}
    />
  );
}
