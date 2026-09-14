import { useRef, useState } from "react";
import { useDimensions } from "@/hooks/useDimensions";

const randFloat = () => Math.random() - 0.5;
const randMult = () => 0.6 + Math.random() * 0.8;

export default function HalftoneField({ dotColor, dotColors, bg, dotSize = 3, gap = 9, blobCount = 5, duration = 24 }) {
  const containerRef = useRef(null);
  const { width, height } = useDimensions(containerRef);
  const circleSize = Math.max(width, height);
  const [colorA, colorB] = dotColors ?? [dotColor, null];

  const [blobs] = useState(() =>
    Array.from({ length: blobCount }, () => ({
      top: Math.random() * 85,
      left: Math.random() * 85,
      wMult: randMult(),
      hMult: randMult(),
      duration: duration * (0.75 + Math.random() * 0.5),
      tx1: randFloat(),
      ty1: randFloat(),
      tx2: randFloat(),
      ty2: randFloat(),
      tx3: randFloat(),
      ty3: randFloat(),
      tx4: randFloat(),
      ty4: randFloat()
    }))
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${colorA} ${dotSize / 2}px, transparent ${dotSize / 2 + 0.6}px)`,
          backgroundSize: `${gap}px ${gap}px`
        }}
      />

      {colorB && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${colorB} ${dotSize / 2}px, transparent ${dotSize / 2 + 0.6}px)`,
            backgroundSize: `${gap}px ${gap}px`,
            maskImage: "linear-gradient(115deg, transparent 15%, black 80%)",
            WebkitMaskImage: "linear-gradient(115deg, transparent 15%, black 80%)"
          }}
        />
      )}

      {blobs.map((b, i) => (
        <svg
          key={i}
          className="blob-animate absolute"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            filter: "blur(30px)",
            "--blob-speed": `${b.duration}s`,
            "--tx-1": b.tx1,
            "--ty-1": b.ty1,
            "--tx-2": b.tx2,
            "--ty-2": b.ty2,
            "--tx-3": b.tx3,
            "--ty-3": b.ty3,
            "--tx-4": b.tx4,
            "--ty-4": b.ty4
          }}
          width={circleSize * 0.55 * b.wMult || 200}
          height={circleSize * 0.55 * b.hMult || 200}
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="50" fill={bg} />
        </svg>
      ))}
    </div>
  );
}
