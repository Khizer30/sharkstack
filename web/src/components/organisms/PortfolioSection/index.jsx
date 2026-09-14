import { useMotionValue, useSpring, useScroll, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useExploreCursor } from "@/components/atoms/ExploreCursor";
import CursorCard from "@/components/molecules/PortfolioSection/CursorCard";
import PortfolioHeader from "@/components/molecules/PortfolioSection/PortfolioHeader";
import PortfolioList from "@/components/molecules/PortfolioSection/PortfolioList";
import ViewAllWorksLink from "@/components/molecules/PortfolioSection/ViewAllWorksLink";
import { colors } from "@/constants/colors";
import { portfolioIntroContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePortfolios } from "@/hooks/usePortfolios";

export default function PortfolioSection() {
  const [activeId, setActiveId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const { projects, status } = usePortfolios();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 });

  const { handlers: exploreHandlers, element: exploreCursor } = useExploreCursor({ label: "View Project", bg: colors.black, color: colors.white });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const textScale = useTransform(scrollYProgress, [0, 0.25], [0.25, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY + 24);
    exploreHandlers.onMouseMove(e);
  };

  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  const visibleProjects = projects.slice(0, 5);
  const isFailed = status === "failed";
  const displayProjects =
    status === "succeeded" ? visibleProjects : Array.from({ length: 5 }, (_, i) => visibleProjects[i] ?? { id: `skeleton-${i}`, isSkeleton: true, isFailed });

  return (
    <section
      ref={containerRef}
      style={{
        background: `linear-gradient(to bottom, ${colors.bgDark} 0%, ${colors.bgBrand} 35%)`,
        color: colors.white,
        position: "relative",
        width: "100%",
        paddingTop: "clamp(5rem, 10vw, 10rem)"
      }}
    >
      <div
        data-cursor-none
        onMouseMove={handleMouseMove}
        onMouseEnter={!isMobile ? exploreHandlers.onMouseEnter : undefined}
        onMouseLeave={!isMobile ? exploreHandlers.onMouseLeave : undefined}
        style={{ cursor: isMobile ? "auto" : "none" }}
      >
        <PortfolioHeader label={portfolioIntroContent.label} scale={textScale} opacity={textOpacity} />

        <PortfolioList projects={displayProjects} activeId={activeId} setActiveId={setActiveId} isMobile={isMobile} />
      </div>

      <ViewAllWorksLink />

      {!isMobile &&
        mounted &&
        createPortal(
          <>
            <CursorCard project={activeProject} cursorX={cursorX} cursorY={cursorY} />
            {exploreCursor}
          </>,
          document.body
        )}
    </section>
  );
}
