import { useState, useRef, useCallback, useEffect } from "react";
import FollowButton from "@/components/molecules/ExploreProducts/FollowButton";
import IntroCard from "@/components/molecules/ExploreProducts/IntroCard";
import ProductCard from "@/components/molecules/ExploreProducts/ProductCard";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { exploreProductsContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePortfolios } from "@/hooks/usePortfolios";

function widthFor(index, activeIndex) {
  if (index === activeIndex) return "35%";
  return Math.abs(index - activeIndex) === 1 ? "20%" : "15%";
}

export default function ExploreProducts() {
  const isMobile = useIsMobile();
  const { projects } = usePortfolios();
  const FEATURED = projects.slice(0, exploreProductsContent.featuredCount);
  const [hovered, setHovered] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const prevCursor = useRef({ x: 0, y: 0 });
  const { transitionTo } = usePageTransition();
  const activeIndex = hovered ?? 0;

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - prevCursor.current.x;
    const dy = e.clientY - prevCursor.current.y;
    const ease = 0.2;
    const nextX = prevCursor.current.x + dx * ease;
    const nextY = prevCursor.current.y + dy * ease;
    setCursor({ x: nextX, y: nextY });
    prevCursor.current = { x: nextX, y: nextY };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const updateCursorPosition = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafRef.current = null;
      });
    };
    window.addEventListener("mousemove", updateCursorPosition);
    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, handleMouseMove]);

  const handleEnter = (index) => {
    setHovered(index);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, 50);
  };

  const handleLeave = () => {
    setHovered(null);
    setOpacity(0);
    setScale(0.5);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const followText = hovered === 0 ? exploreProductsContent.viewAllLabel : "View Project";

  return (
    <section className="relative w-full" style={{ background: colors.cream, padding: "clamp(4rem, 8vw, 6rem) clamp(2rem, 6vw, 7rem)" }}>
      <div className="mb-10 md:hidden">
        <h2 style={{ ...fonts.poppinsBold, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: colors.black, letterSpacing: "-0.02em" }}>
          {exploreProductsContent.heading}
        </h2>
        <p style={{ ...fonts.montRegular, fontSize: "0.95rem", color: `${colors.black}90`, marginTop: "0.75rem", maxWidth: "28rem" }}>
          {exploreProductsContent.description}
        </p>
      </div>

      <div className="hidden md:flex items-start gap-3" style={{ height: "600px" }} onMouseLeave={handleLeave}>
        <IntroCard
          content={exploreProductsContent}
          width={widthFor(0, activeIndex)}
          isActive={activeIndex === 0}
          onMouseEnter={() => handleEnter(0)}
          onViewAllClick={() => transitionTo("/portfolio")}
        />

        {FEATURED.map((project, i) => {
          const index = i + 1;
          return (
            <ProductCard
              key={project.id}
              project={project}
              index={index}
              width={widthFor(index, activeIndex)}
              isActive={activeIndex === index}
              onMouseEnter={() => handleEnter(index)}
              onClick={() => transitionTo(`/portfolio/${project.id}`)}
            />
          );
        })}
      </div>

      {!isMobile && hovered !== null && <FollowButton text={followText} cursor={cursor} opacity={opacity} scale={scale} />}

      <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {FEATURED.map((project) => (
          <div
            key={project.id}
            onClick={() => transitionTo(`/portfolio/${project.id}`)}
            className="relative shrink-0 overflow-hidden rounded-[4px] cursor-pointer"
            style={{ width: "260px", aspectRatio: "3 / 4", background: project.bg }}
          >
            <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, ${colors.black}D9 0%, transparent 50%)` }} />
            <div className="absolute bottom-5 left-5 right-5">
              <p style={{ ...fonts.poppinsSemiBold, fontSize: "1.05rem", color: colors.white }}>{project.name}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => transitionTo("/portfolio")}
        className="md:hidden mt-6 w-full flex items-center justify-center gap-2 rounded-[4px] cursor-pointer"
        style={{
          ...fonts.montSemiBold,
          fontSize: "0.9rem",
          color: colors.white,
          background: colors.black,
          padding: "1rem 1.5rem"
        }}
      >
        <span>{exploreProductsContent.viewAllLabel}</span>
        <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: colors.primary }} />
      </button>
    </section>
  );
}
