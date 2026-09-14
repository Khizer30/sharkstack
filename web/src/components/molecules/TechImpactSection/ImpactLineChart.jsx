import { motion } from "motion/react";
import { useId } from "react";
import { colors } from "@/constants/colors";

const W = 400;
const H = 140;
const PAD = 6;
const GRID_LINES = [0.15, 0.4, 0.65, 0.9];

function buildPoints(series) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const xStep = (W - PAD * 2) / (series.length - 1);
  return series.map((v, i) => ({
    x: PAD + i * xStep,
    y: PAD + (H - PAD * 2) * (1 - (v - min) / range)
  }));
}

function buildLinePath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i],
      p1 = points[i + 1];
    const cx = p0.x + (p1.x - p0.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function ImpactLineChart({ series, color = colors.white, fillColor = colors.primary }) {
  const gradientId = useId();
  const points = buildPoints(series);
  const linePath = buildLinePath(points);
  const last = points[points.length - 1];
  const areaPath = `${linePath} L ${last.x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {GRID_LINES.map((t) => (
        <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} stroke={`${colors.white}14`} strokeWidth="1" />
      ))}

      <motion.path
        d={areaPath}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.circle
        cx={last.x}
        cy={last.y}
        r="4"
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1.8 }}
      />
    </svg>
  );
}
