import { useEffect, useRef } from "react";
import { colors } from "@/constants/colors";

const W = 100;
const H = 52;

const faceSymbol = ["@", "#", "$", "*"];

const faceColor = [colors.primary, colors.pyramidFace2, colors.pyramidFace3, colors.pyramidFace4];

const SCALE = 2;
const DESIRED_DIST = 4.5;

const V = [
  [0.0, SCALE, 0.0],
  [-SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, SCALE],
  [-SCALE, -SCALE, SCALE]
];

const F = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 1]
];

const EDGE_LIST = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1]
];

const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm3 = (v) => {
  const r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / r, v[1] / r, v[2] / r];
};

// Matches the previous `clamp(5px, 1.6vw, 12.48px)` CSS font-size.
const clampFontSize = () => Math.min(12.48, Math.max(5, window.innerWidth * 0.016));

export default function AsciiPyramid({ theta = 0, axis = "y", edges = false, color = true, step = 0.008 }) {
  const canvasRef = useRef(null);
  const layoutRef = useRef(null);
  const drawRef = useRef(null);
  const thetaRef = useRef(theta);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (theta) => {
      const { fontSize, cellW, cellH, width, height } = layoutRef.current;
      ctx.clearRect(0, 0, width, height);

      const DU = step,
        DV = step;
      const faceBuf = Array(W * H).fill(-1);
      const lumBuf = Array(W * H).fill(0);
      const zBuf = Array(W * H).fill(0);

      const cm = [0, 0, 0];
      for (let i = 0; i < 5; i++) {
        cm[0] += V[i][0];
        cm[1] += V[i][1];
        cm[2] += V[i][2];
      }
      cm[0] *= 0.2;
      cm[1] *= 0.2;
      cm[2] *= 0.2;

      const fnorm = F.map((f) => norm3(cross3(sub3(V[f[1]], V[f[0]]), sub3(V[f[2]], V[f[0]]))));
      const light = norm3([0, 1, -1]);

      const c = Math.cos(theta),
        s = Math.sin(theta);
      const cz = -cm[0] * s + cm[2] * c;
      const offset = DESIRED_DIST - cz;

      const XS = 46,
        YS = 24,
        YO = -5;

      for (let f = 0; f < 4; f++) {
        for (let u = 0; u <= 1; u += DU) {
          for (let v = 0; u + v <= 1; v += DV) {
            const w = 1 - u - v;
            const x = w * V[F[f][0]][0] + u * V[F[f][1]][0] + v * V[F[f][2]][0];
            const y = w * V[F[f][0]][1] + u * V[F[f][1]][1] + v * V[F[f][2]][1];
            const z = w * V[F[f][0]][2] + u * V[F[f][1]][2] + v * V[F[f][2]][2];
            let x2 = x,
              y2 = y,
              z2 = z;
            if (axis === "y") {
              x2 = x * c + z * s;
              z2 = -x * s + z * c;
            } else if (axis === "x") {
              y2 = y * c - z * s;
              z2 = y * s + z * c;
            } else {
              x2 = x * c - y * s;
              y2 = x * s + y * c;
            }
            const zt = z2 + offset;
            if (zt <= 0) continue;
            const invz = 1 / zt;
            const px = Math.floor(W / 2 + XS * x2 * invz);
            const py = Math.floor(H / 2 - YS * y2 * invz + YO);
            if (px < 0 || px >= W || py < 0 || py >= H) continue;
            const idx = px + py * W;
            if (invz <= zBuf[idx]) continue;
            zBuf[idx] = invz;
            let nx = fnorm[f][0],
              ny = fnorm[f][1],
              nz = fnorm[f][2];
            if (axis === "y") {
              nx = fnorm[f][0] * c + fnorm[f][2] * s;
              nz = -fnorm[f][0] * s + fnorm[f][2] * c;
            }
            let L = nx * light[0] + ny * light[1] + nz * light[2];
            if (L < 0) L = 0;
            lumBuf[idx] = L;
            faceBuf[idx] = f;
          }
        }
      }

      if (edges) {
        for (const [a, b] of EDGE_LIST) {
          for (let t = 0; t <= 1; t += 0.002) {
            const x = V[a][0] + (V[b][0] - V[a][0]) * t;
            const z = V[a][2] + (V[b][2] - V[a][2]) * t;
            let x2 = x,
              z2 = z;
            if (axis === "y") {
              x2 = x * c + z * s;
              z2 = -x * s + z * c;
            }
            const zt = z2 + offset;
            if (zt <= 0) continue;
            const invz = 1 / zt;
            const px = Math.floor(W / 2 + XS * x2 * invz);
            const py = Math.floor(H / 2 - YS * (V[a][1] + (V[b][1] - V[a][1]) * t) * invz - 4);
            if (px < 0 || px >= W || py < 0 || py >= H) continue;
            const idx = px + py * W;
            if (invz > zBuf[idx]) {
              zBuf[idx] = invz + 1e-6;
              faceBuf[idx] = -2;
            }
          }
        }
      }

      // Group characters by (color, weight) so we only touch fillStyle/font
      // a handful of times per frame instead of once per glyph.
      const groups = new Map();
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = x + y * W,
            f = faceBuf[i];
          if (f === -1) continue;
          const ch = f === -2 ? "+" : faceSymbol[f];
          const bold = f === -2 ? true : lumBuf[i] > 0.6;
          const col = f === -2 ? colors.white : color ? faceColor[f] : colors.white;
          const key = `${col}|${bold}`;
          let group = groups.get(key);
          if (!group) {
            group = { col, bold, points: [] };
            groups.set(key, group);
          }
          group.points.push([x, y, ch]);
        }
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      groups.forEach(({ col, bold, points }) => {
        ctx.font = `${bold ? "bold" : "normal"} ${fontSize}px monospace`;
        ctx.fillStyle = col;
        points.forEach(([x, y, ch]) => {
          ctx.fillText(ch, (x + 0.5) * cellW, (y + 0.5) * cellH);
        });
      });
    };

    drawRef.current = draw;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fontSize = clampFontSize();
      const lineHeight = fontSize * 1.05;

      ctx.font = `${fontSize}px monospace`;
      const cellW = ctx.measureText("@").width;
      const cellH = lineHeight;

      const width = cellW * W;
      const height = cellH * H;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      layoutRef.current = { fontSize, cellW, cellH, width, height };
      draw(thetaRef.current);
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [axis, edges, color, step]);

  useEffect(() => {
    thetaRef.current = theta;
    if (layoutRef.current) drawRef.current?.(theta);
  }, [theta]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", userSelect: "none" }} />;
}
