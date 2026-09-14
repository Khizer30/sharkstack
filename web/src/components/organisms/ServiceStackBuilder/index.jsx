import { motion, useAnimation, AnimatePresence, useMotionValue, useMotionTemplate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LaptopIcon, LatticeIcon, OrbitRingsIcon, SparkleIcon, FinIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { scrollToId } from "@/utils/helpers";

const GRID = {
  STUD_WIDTH: 65,
  ROW_HEIGHT: 80,
  MAX_ROWS: 20,
  COLS: 6,
  APEX_HEIGHT: 150
};

function buildTheme(hex) {
  return {
    topColor: hex,
    faceGradient: `linear-gradient(180deg, color-mix(in srgb, ${hex} 85%, white) 0%, ${hex} 50%, color-mix(in srgb, ${hex} 78%, black) 100%)`,
    bottomColor: `color-mix(in srgb, ${hex} 55%, black)`,
    wall: `linear-gradient(90deg, color-mix(in srgb, ${hex} 55%, black) 0%, color-mix(in srgb, ${hex} 75%, black) 20%, color-mix(in srgb, ${hex} 90%, black) 38%, ${hex} 50%, color-mix(in srgb, ${hex} 90%, black) 62%, color-mix(in srgb, ${hex} 75%, black) 80%, color-mix(in srgb, ${hex} 55%, black) 100%)`,
    cap: `linear-gradient(135deg, color-mix(in srgb, ${hex} 40%, white) 0%, color-mix(in srgb, ${hex} 70%, white) 40%, ${hex} 70%, color-mix(in srgb, ${hex} 85%, black) 100%)`,
    shadow: `radial-gradient(ellipse, color-mix(in srgb, ${hex} 65%, black) 0%, transparent 70%)`
  };
}

const SERVICES = [
  { id: "web-app-dev", name: "Web & App Dev", icon: LaptopIcon, studs: 4, theme: buildTheme(colors.chart2) },
  { id: "backend-apis", name: "Backend & APIs", icon: LatticeIcon, studs: 3, theme: buildTheme(colors.chart5) },
  { id: "ui-ux-design", name: "UI/UX Design", icon: OrbitRingsIcon, studs: 2, theme: buildTheme(colors.chart3) },
  { id: "ai-automation", name: "AI & Automation", icon: SparkleIcon, studs: 3, theme: buildTheme(colors.chart4) }
];

const BASE_THEME = buildTheme(colors.primary);

function LegoStud({ theme, yOffset = 0 }) {
  return (
    <div className="flex-1 flex items-end justify-center relative" style={{ transform: `translateY(${yOffset}px)` }}>
      <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[75%] rounded-[50%] z-0" style={{ height: "10px", background: theme.shadow }} />
      <div className="relative z-10" style={{ width: "72%", maxWidth: "42px", marginBottom: "-1px" }}>
        <div className="w-full relative overflow-hidden" style={{ height: "16px", borderRadius: "50% / 20%", background: theme.wall }}>
          <div
            className="absolute top-0 h-full w-[25%] left-[20%]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </div>
        <div
          className="absolute left-0 w-full rounded-[50%] flex items-center justify-center overflow-hidden"
          style={{
            top: "-8px",
            height: "16px",
            background: theme.cap,
            boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.4)",
            borderTop: "1px solid rgba(255,255,255,0.65)"
          }}
        />
      </div>
    </div>
  );
}

function LegoBlock({ mouseX, mouseY, theme, studs = 0, hideStuds = false, children }) {
  const highlightBg = useMotionTemplate`radial-gradient(circle 120px at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.25), transparent)`;

  return (
    <div className="relative w-full">
      <div
        className="relative w-full"
        style={{
          height: "19px",
          background: `linear-gradient(to bottom, ${theme.topColor}, color-mix(in srgb, ${theme.topColor} 100%, black))`,
          boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.28)",
          borderRadius: "4px 4px 0 0"
        }}
      >
        {studs > 0 && (
          <div className="absolute bottom-full left-0 w-full flex">
            {Array.from({ length: studs }).map((_, i) => {
              const isHidden = Array.isArray(hideStuds) ? hideStuds.includes(i) : hideStuds;
              return isHidden ? <div key={i} className="flex-1" /> : <LegoStud key={i} theme={theme} yOffset={12} />;
            })}
          </div>
        )}
      </div>

      <div
        className="relative w-full border-x border-black/5 overflow-hidden"
        style={{ background: theme.faceGradient, boxShadow: "inset 0px 2px 6px rgba(255,255,255,0.47)" }}
      >
        <motion.div className="absolute inset-0 z-20 pointer-events-none opacity-60" style={{ background: highlightBg }} />
        <div className="relative z-30">{children}</div>
      </div>

      <div
        className="relative w-full"
        style={{ height: "15px", background: theme.bottomColor, boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.15)", borderRadius: "0 0 4px 4px" }}
      />
    </div>
  );
}

function ServiceBrick({ service, hiddenStuds = [], onClick, isAnimating, startRect, mouseX, mouseY, onAnimationComplete }) {
  const widthPx = service.studs * GRID.STUD_WIDTH;
  const isCompact = service.studs <= 2;
  const wrapperRef = useRef(null);
  const Icon = service.icon;

  useEffect(() => {
    if (!(isAnimating && startRect && wrapperRef.current)) return;
    const endRect = wrapperRef.current.getBoundingClientRect();
    const dx = startRect.left - endRect.left;
    const dy = startRect.top - endRect.top;
    const apexY = Math.min(dy, 0) - GRID.APEX_HEIGHT;

    const animation = wrapperRef.current.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(1, 1)`, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 0 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.1, 0.85)`, filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.15 },
        {
          transform: `translate(${dx * 0.75}px, ${dy + (apexY - dy) * 0.5}px) scale(0.9, 1.15)`,
          filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))",
          offset: 0.35
        },
        { transform: `translate(${dx * 0.5}px, ${apexY}px) scale(1, 1)`, filter: "drop-shadow(0px 40px 20px rgba(0,0,0,0))", offset: 0.55 },
        { transform: `translate(${dx * 0.25}px, ${apexY * 0.5}px) scale(0.9, 1.15)`, filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))", offset: 0.75 },
        { transform: "translate(0px, 0px) scale(1.15, 0.85)", filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.9 },
        { transform: "translate(0px, 0px) scale(1, 1)", filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 1 }
      ],
      { duration: 1000, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "both" }
    );

    animation.onfinish = () => onAnimationComplete?.();
    return () => animation.cancel();
  }, [isAnimating, startRect, onAnimationComplete]);

  return (
    <div ref={wrapperRef} className="z-50 relative lego-brick-wrapper" style={{ width: widthPx }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Toggle ${service.name}`}
        className="cursor-pointer w-full shrink-0 touch-none group relative focus:outline-none focus-visible:ring-4 rounded-lg hover:-translate-y-1.5 active:scale-95 transition-all duration-200 text-left"
        style={{ "--tw-ring-color": `${colors.primary}55` }}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-30 rounded-lg pointer-events-none" />
        <LegoBlock theme={service.theme} studs={service.studs} hideStuds={hiddenStuds} mouseX={mouseX} mouseY={mouseY}>
          <div className={`flex items-center w-full h-[56px] ${isCompact ? "px-3 gap-2" : "px-4 gap-3"}`}>
            <div
              className={`${isCompact ? "w-7 h-7" : "w-9 h-9"} rounded-lg bg-black/20 flex items-center justify-center shrink-0`}
              style={{ color: colors.white }}
            >
              <Icon size={isCompact ? 16 : 20} />
            </div>
            <span
              className="truncate"
              style={{ ...fonts.montBold, fontSize: isCompact ? "0.8rem" : "0.9rem", color: colors.white, textShadow: "0 1px 1px rgba(0,0,0,0.5)" }}
            >
              {service.name}
            </span>
          </div>
        </LegoBlock>
      </button>
    </div>
  );
}

export default function ServiceStackBuilder() {
  const [equippedIds, setEquippedIds] = useState([]);
  const [animating, setAnimating] = useState({});
  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const toggleService = (id, e) => {
    if (animating[id]) return;
    const el = e.currentTarget.closest(".lego-brick-wrapper");
    if (!el) return;
    const startRect = el.getBoundingClientRect();

    setAnimating((prev) => ({ ...prev, [id]: startRect }));
    setEquippedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    setTimeout(() => {
      controls.start({ y: [0, 8, -2, 0], transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" } });
    }, 900);
  };

  const equipped = equippedIds.map((id) => SERVICES.find((s) => s.id === id));
  const unequipped = SERVICES.filter((s) => !equippedIds.includes(s.id));

  const { grid, positioned } = useMemo(() => {
    const calculatedGrid = [];
    const result = equipped.map((service) => {
      let placedRow = -1;
      let placedCol = -1;
      for (let r = 0; r < GRID.MAX_ROWS; r++) {
        if (!calculatedGrid[r]) calculatedGrid[r] = Array(GRID.COLS).fill(null);
        let contiguous = 0;
        for (let c = 0; c < GRID.COLS; c++) {
          if (!calculatedGrid[r][c]) {
            contiguous++;
            if (contiguous === service.studs) {
              placedRow = r;
              placedCol = c - service.studs + 1;
              break;
            }
          } else {
            contiguous = 0;
          }
        }
        if (placedRow !== -1) break;
      }
      if (placedRow !== -1) {
        for (let i = 0; i < service.studs; i++) calculatedGrid[placedRow][placedCol + i] = service.id;
      } else {
        placedRow = 0;
        placedCol = 0;
      }
      return { service, rowIndex: placedRow, colIndex: placedCol };
    });
    return { grid: calculatedGrid, positioned: result };
  }, [equipped]);

  const hiddenBaseStuds = [];
  if (grid[0]) {
    grid[0].forEach((occupantId, idx) => {
      if (occupantId && !animating[occupantId]) hiddenBaseStuds.push(idx);
    });
  }

  const towerHeight = equipped.length > 0 ? (Math.max(...positioned.map((m) => m.rowIndex)) + 1) * GRID.ROW_HEIGHT : 0;

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative w-full overflow-hidden select-none rounded-[1.75rem]"
      style={{ background: colors.cream, padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)" }}
    >
      <div className="text-center" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <span style={{ ...fonts.montBold, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: colors.primary }}>Just for fun</span>
        <h3 style={{ ...fonts.poppinsBold, fontSize: "clamp(1.3rem, 3vw, 1.75rem)", color: colors.textPrimary, marginTop: "0.5rem" }}>
          Snap your stack together
        </h3>
        <p style={{ ...fonts.montRegular, fontSize: "0.9rem", color: colors.textSecondary, marginTop: "0.4rem" }}>
          Tap a service to build your SharkStack — tap it again to take it back off.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        <div className="flex-1 w-full max-w-[420px] flex flex-wrap justify-center lg:justify-start gap-4" style={{ minHeight: "160px" }}>
          {unequipped.map((service) => {
            const startRect = animating[service.id];
            return (
              <ServiceBrick
                key={service.id}
                service={service}
                mouseX={mouseX}
                mouseY={mouseY}
                isAnimating={!!startRect}
                startRect={startRect || null}
                onAnimationComplete={() =>
                  setAnimating((prev) => {
                    const next = { ...prev };
                    delete next[service.id];
                    return next;
                  })
                }
                onClick={(e) => toggleService(service.id, e)}
              />
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-8 w-full lg:w-auto">
          <div className="scale-[0.85] sm:scale-100 origin-bottom shrink-0 flex flex-col items-center">
            <motion.div
              animate={controls}
              className="relative shadow-[0_15px_35px_rgba(0,0,0,0.2)] rounded-xl"
              style={{ width: GRID.STUD_WIDTH * 6, marginTop: `${towerHeight}px` }}
            >
              <div className="absolute left-0 w-full h-0 z-20" style={{ bottom: "calc(100% - 14px)" }}>
                {positioned.map(({ service, rowIndex, colIndex }) => {
                  const hiddenLocal = [];
                  if (grid[rowIndex + 1]) {
                    for (let i = 0; i < service.studs; i++) {
                      const occupantId = grid[rowIndex + 1][colIndex + i];
                      if (occupantId && !animating[occupantId]) hiddenLocal.push(i);
                    }
                  }
                  const startRect = animating[service.id];
                  return (
                    <div
                      key={service.id}
                      className="absolute"
                      style={{ bottom: rowIndex * GRID.ROW_HEIGHT, left: colIndex * GRID.STUD_WIDTH, zIndex: rowIndex * 10 }}
                    >
                      <ServiceBrick
                        service={service}
                        hiddenStuds={hiddenLocal}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        isAnimating={!!startRect}
                        startRect={startRect || null}
                        onAnimationComplete={() =>
                          setAnimating((prev) => {
                            const next = { ...prev };
                            delete next[service.id];
                            return next;
                          })
                        }
                        onClick={(e) => toggleService(service.id, e)}
                      />
                    </div>
                  );
                })}
              </div>

              <LegoBlock theme={BASE_THEME} studs={6} hideStuds={hiddenBaseStuds} mouseX={mouseX} mouseY={mouseY}>
                <div className="px-4 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center shrink-0" style={{ color: colors.white }}>
                    <FinIcon size={18} />
                  </div>
                  <div style={{ color: colors.white }}>
                    <span style={{ ...fonts.montBold, fontSize: "0.95rem", display: "block" }}>Your SharkStack</span>
                    <span
                      style={{
                        ...fonts.montMedium,
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        opacity: 0.8,
                        display: "block",
                        marginTop: "0.2rem"
                      }}
                    >
                      {equipped.length === 0 ? "Empty build" : `${equipped.length} service${equipped.length > 1 ? "s" : ""} snapped in`}
                    </span>
                  </div>
                </div>
              </LegoBlock>
            </motion.div>
          </div>

          <AnimatePresence>
            {equipped.length > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToId("choose-services")}
                style={{
                  ...fonts.montBold,
                  fontSize: "0.85rem",
                  padding: "0.85rem 1.75rem",
                  borderRadius: "9999px",
                  background: colors.textPrimary,
                  color: colors.white,
                  cursor: "pointer",
                  border: "none"
                }}
              >
                Pick these for real →
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
