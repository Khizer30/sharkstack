import { useEffect, useRef } from "react";
import { colors } from "@/constants/colors";

const CELL_SIZE = 32;
const GAP = 3;
const PULSE_DURATION = 3400;
const PULSE_SPEED = 0.12;
const GLOW_RADIUS = 220;

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function PulseGridBackground({ baseColor = colors.cream, accentColor = colors.primary }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });
  const stateRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, animationId: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [br, bg, bb] = hexToRgb(baseColor);
    const [ar, ag, ab] = hexToRgb(accentColor);
    const state = stateRef.current;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = state.width * dpr;
      canvas.height = state.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.cols = Math.ceil(state.width / CELL_SIZE) + 1;
      state.rows = Math.ceil(state.height / CELL_SIZE) + 1;
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, state.width, state.height);
      const centerCol = state.cols / 2;
      const centerRow = state.rows / 2;
      const pointer = pointerRef.current;

      for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
          const x = c * CELL_SIZE;
          const y = r * CELL_SIZE;
          const dr = r - centerRow;
          const dc = c - centerCol;
          const dist = Math.sqrt(dr * dr + dc * dc);
          const phase = (((time / PULSE_DURATION - dist * PULSE_SPEED) % 1) + 1) % 1;
          const wave = Math.pow(Math.sin(phase * Math.PI), 2);
          const baseOpacity = 0.04 + 0.2 * wave;

          const px = x - pointer.x;
          const py = y - pointer.y;
          const glow = Math.max(0, 1 - Math.sqrt(px * px + py * py) / GLOW_RADIUS);

          const rr = br + (ar - br) * glow;
          const gg = bg + (ag - bg) * glow;
          const bbv = bb + (ab - bb) * glow;

          ctx.fillStyle = `rgb(${rr | 0}, ${gg | 0}, ${bbv | 0})`;
          ctx.globalAlpha = Math.min(0.9, baseOpacity + glow * 0.4);
          ctx.fillRect(x, y, CELL_SIZE - GAP, CELL_SIZE - GAP);
        }
      }
      ctx.globalAlpha = 1;
      state.animationId = requestAnimationFrame(draw);
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);

    // Only run the render loop while this canvas is actually visible —
    // avoids redrawing every frame for the whole session once scrolled past.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!state.animationId) state.animationId = requestAnimationFrame(draw);
      } else if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = 0;
      }
    });
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      observer.disconnect();
      cancelAnimationFrame(state.animationId);
    };
  }, [baseColor, accentColor]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
