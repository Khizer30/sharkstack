import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import PortfolioCard from "@/components/atoms/PortfolioCard";
import { PortfolioMetaLeft, PortfolioMetaRight } from "@/components/atoms/PortfolioMeta";
import Spinner from "@/components/atoms/Spinner";
import { colors } from "@/constants/colors";
import { usePortfolios } from "@/hooks/usePortfolios";
import { usePortfolioScroll } from "@/hooks/usePortfolioScroll";

const metaTransition = { type: "spring", stiffness: 80, damping: 18, mass: 0.8 };

const PHASE_TIMES = [
  [1000, "zigzag"],
  [2200, "carousel-entry"],
  [3400, "scroll"]
];

export default function PortfolioCarousel() {
  const { projects, status } = usePortfolios();
  const [activeIndex, setActiveIndex] = useState(0);
  const [introPhase, setIntroPhase] = useState("stack");
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredBg, setHoveredBg] = useState(null);

  const handleHoverStart = useCallback((bg) => setHoveredBg(bg), []);
  const handleHoverEnd = useCallback(() => setHoveredBg(null), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { containerRef, sectionRef, activeProgress, itemStepMV } = usePortfolioScroll(projects.length, setActiveIndex);

  useEffect(() => {
    const timers = PHASE_TIMES.map(([ms, phase]) => setTimeout(() => setIntroPhase(phase), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "portfolio-hide-scrollbar";
    style.textContent = `
      html { scrollbar-width: none; }
      html::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("portfolio-hide-scrollbar")?.remove();
  }, []);

  const hasProjects = projects.length > 0;
  const active = projects[activeIndex] ?? projects[0];
  const showMeta = introPhase === "scroll" && hasProjects;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <section
        ref={sectionRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: colors.bgBrand
        }}
      >
        {!hasProjects ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {status === "failed" ? (
              <span style={{ color: `${colors.white}80` }}>Projects are unavailable right now.</span>
            ) : (
              <Spinner size={22} color={colors.white} />
            )}
          </div>
        ) : (
          <>
            {/* Hover glow overlay */}
            <AnimatePresence>
              {hoveredBg && (
                <motion.div
                  key={hoveredBg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 5,
                    pointerEvents: "none",
                    background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${hoveredBg}28 0%, ${hoveredBg}08 45%, transparent 70%)`
                  }}
                />
              )}
            </AnimatePresence>

            {projects.map((project, i) => (
              <PortfolioCard
                key={project.id}
                data={project}
                index={i}
                total={projects.length}
                introPhase={introPhase}
                isActive={i === activeIndex}
                activeProgress={activeProgress}
                itemStepMV={itemStepMV}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
              />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showMeta ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position: "absolute",
                ...(isMobile ? { bottom: "2.5rem", top: "auto", transform: "none" } : { top: "50%", transform: "translateY(-50%)" }),
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-end" : "center",
                padding: "0 clamp(1.25rem, 4vw, 5.5rem)",
                zIndex: 40,
                pointerEvents: showMeta ? "auto" : "none"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={metaTransition}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                  }}
                >
                  <PortfolioMetaLeft project={active} index={activeIndex} />
                  <PortfolioMetaRight />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}
