import { useEffect, useRef } from "react";

const DEFAULT_PIXEL_SIZE = 8;

export default function PixelOverlay({ active, pixelSize = DEFAULT_PIXEL_SIZE, color, style }) {
  const canvasRef = useRef(null);
  const s = useRef({ pixels: null, ctx: null, W: 0, H: 0, raf: null, hovering: false, tick: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = s.current;
    const PX = pixelSize;

    const init = () => {
      state.W = canvas.offsetWidth;
      state.H = canvas.offsetHeight;
      canvas.width = state.W;
      canvas.height = state.H;
      state.ctx = canvas.getContext("2d");
      const cols = Math.ceil(state.W / PX);
      const rows = Math.ceil(state.H / PX);
      state.pixels = Array.from({ length: cols * rows }, (_, i) => ({
        x: (i % cols) * PX,
        y: Math.floor(i / cols) * PX,
        op: 0,
        target: 0
      }));
    };
    init();

    const tick = () => {
      const { ctx, W, H, pixels, hovering } = state;
      if (!pixels) return;
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      for (const px of pixels) {
        if (hovering && Math.random() < 0.003) {
          px.target = Math.random() < 0.25 ? 0 : Math.random() * 0.62 + 0.08;
        } else if (!hovering) {
          px.target = 0;
        }

        const diff = px.target - px.op;
        if (Math.abs(diff) > 0.004) {
          px.op += diff * 0.13;
          alive = true;
        } else {
          px.op = px.target;
        }

        if (px.op > 0.01) {
          ctx.fillStyle = color ? color.replace("{op}", px.op.toFixed(2)) : `rgba(255,255,255,${px.op.toFixed(2)})`;
          ctx.fillRect(px.x, px.y, PX - 1, PX - 1);
          alive = true;
        }
      }

      state.raf = state.hovering || alive ? requestAnimationFrame(tick) : null;
    };

    state.tick = tick;
    return () => {
      if (state.raf) cancelAnimationFrame(state.raf);
    };
  }, [pixelSize, color]);

  useEffect(() => {
    const state = s.current;
    state.hovering = active;
    if (active && !state.raf && state.tick) {
      state.raf = requestAnimationFrame(state.tick);
    }
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        borderRadius: "inherit",
        ...style
      }}
    />
  );
}
