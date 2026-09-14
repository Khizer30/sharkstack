import { useEffect, useRef } from "react";
import { colors } from "@/constants/colors";

const hexToRgba = (hex, alpha) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export default function CircleAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;
    let timer = 0;
    let sweepCircles = [];
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initSweep = () => {
      sweepCircles = Array.from({ length: 300 }, () => ({
        x: Math.random() * canvas.width * 1.8 + canvas.width * 1.2,
        y: Math.random() * canvas.height * 1.2 - canvas.height * 0.2,
        size: canvas.width / 1000
      }));
    };

    const initParticles = () => {
      particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.1 + 0.03
      }));
    };

    const draw = () => {
      timer++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Sweep circles (one-shot, right → left) ──
      const distX = canvas.width / 80;
      const growth = canvas.width / 1200;

      sweepCircles.forEach((c) => {
        ctx.beginPath();
        if (timer < 65) {
          c.x -= distX;
          c.size += growth;
        } else if (timer < 500) {
          c.x -= distX * 0.015;
          c.size += growth * 0.1;
        }
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors.primary, 0.028);
        ctx.fill();
      });

      // ── Drifting particles (infinite) ──
      particles.forEach((p) => {
        p.x -= p.speed;
        if (p.x < -4) {
          p.x = canvas.width + 4;
          p.y = Math.random() * canvas.height;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    const restart = () => {
      resize();
      timer = 0;
      initSweep();
      initParticles();
    };

    resize();
    initSweep();
    initParticles();
    draw();
    window.addEventListener("resize", restart);
    return () => {
      window.removeEventListener("resize", restart);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
