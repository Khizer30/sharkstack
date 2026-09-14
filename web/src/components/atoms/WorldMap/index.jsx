import { motion, AnimatePresence, useInView } from "motion/react";
import { useState, useMemo, useRef } from "react";
import worldDotsImage from "@/assets/images/world-dots.webp";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";

function projectPoint(lat, lng) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

function createCurvedPath(start, end) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export default function WorldMap({ dots = [], lineColor = colors.primary, showLabels = true, animationDuration = 2 }) {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { margin: "-10% 0px" });

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  const projected = useMemo(
    () =>
      dots.map((dot) => ({
        start: projectPoint(dot.start.lat, dot.start.lng),
        end: projectPoint(dot.end.lat, dot.end.lng)
      })),
    [dots]
  );

  return (
    <div ref={containerRef} style={{ width: "100%", aspectRatio: "2 / 1", position: "relative", overflow: "hidden" }}>
      <img
        src={worldDotsImage}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 50%, white 55%, transparent 100%)",
          maskImage: "radial-gradient(80% 80% at 50% 50%, white 55%, transparent 100%)",
          pointerEvents: "none",
          userSelect: "none"
        }}
      />

      <svg viewBox="0 0 800 400" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="wm-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.white} stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.white} stopOpacity="0" />
          </linearGradient>
          <filter id="wm-glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {inView &&
          dots.map((dot, i) => {
            const { start, end } = projected[i];
            const startTime = (i * staggerDelay) / fullCycleDuration;
            const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
            const resetTime = totalAnimationTime / fullCycleDuration;
            const path = createCurvedPath(start, end);

            return (
              <g key={`path-${i}`}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke="url(#wm-path-gradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 0, 1, 1, 0] }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                />
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0]
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                  style={{ offsetPath: `path('${path}')` }}
                />
              </g>
            );
          })}

        {dots.map((dot, i) => {
          const { start, end } = projected[i];
          return (
            <g key={`points-${i}`}>
              {[
                { point: start, label: dot.start.label, offset: dot.start.labelOffset },
                { point: end, label: dot.end.label, offset: dot.end.labelOffset }
              ].map(({ point, label, offset }, j) => {
                const offsetX = offset?.x ?? 0;
                const offsetY = offset?.y ?? -35;
                return (
                  <g key={j}>
                    <motion.g
                      onHoverStart={() => setHoveredLocation(label || "")}
                      onHoverEnd={() => setHoveredLocation(null)}
                      style={{ cursor: "pointer" }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <circle cx={point.x} cy={point.y} r="3" fill={lineColor} filter="url(#wm-glow)" />
                      <circle cx={point.x} cy={point.y} r="3" fill={lineColor} opacity="0.5">
                        <animate attributeName="r" from="3" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                      </circle>
                    </motion.g>

                    {showLabels && label && (
                      <motion.g
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 * i + 0.3, duration: 0.5 }}
                        style={{ pointerEvents: "none" }}
                      >
                        <foreignObject x={point.x - 50 + offsetX} y={point.y + offsetY} width="100" height="30">
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <span
                              style={{
                                ...fonts.montSemiBold,
                                fontSize: sizes.xs,
                                padding: "0.2rem 0.65rem",
                                borderRadius: "100px",
                                background: `${colors.black}D9`,
                                color: colors.white,
                                border: `1px solid ${colors.white}26`,
                                boxShadow: `0 4px 12px ${colors.black}40`,
                                whiteSpace: "nowrap"
                              }}
                            >
                              {label}
                            </span>
                          </div>
                        </foreignObject>
                      </motion.g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              background: `${colors.black}E6`,
              color: colors.white,
              padding: "0.5rem 0.85rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 500,
              border: `1px solid ${colors.white}26`
            }}
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
