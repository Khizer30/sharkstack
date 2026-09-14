import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestimonialCard from "@/components/molecules/TestimonialsSection/TestimonialCard";
import TestimonialsScrollTracker from "@/components/molecules/TestimonialsSection/TestimonialsScrollTracker";
import { colors } from "@/constants/colors";
import { testimonialsContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTestimonialsScroll } from "@/hooks/useTestimonialsScroll";
import { fetchTestimonials } from "@/store/actions/testimonialActions";
import { normalizeTestimonial } from "@/utils/testimonials";

export default function TestimonialsSection() {
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const isMobile = useIsMobile();
  const settledProgress = useMotionValue(1);

  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.testimonials);
  const testimonials = items.map(normalizeTestimonial);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const { containerRef, sectionRef, trackRef, scrollYProgress, trackX } = useTestimonialsScroll([testimonials.length]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const isActiveMode = activeId !== null;
  const isHoverMode = !isActiveMode && hoveredId !== null;
  const showBackdrop = isActiveMode || isHoverMode;

  const handleClick = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
    setHoveredId(null);
  };
  const handleHoverStart = (id) => {
    if (!isActiveMode) setHoveredId(id);
  };
  const handleHoverEnd = () => {
    if (!isActiveMode) setHoveredId(null);
  };

  const isLoading = status === "loading" && testimonials.length === 0;

  if (isMobile) {
    return (
      <section
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          backgroundColor: colors.bgDark,
          padding: "clamp(3rem, 8vw, 4rem) 0"
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src={testimonialsContent.backgroundImage}
            alt={testimonialsContent.backgroundAlt}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${colors.black}CC 0%, ${colors.black}80 40%, ${colors.black}80 60%, ${colors.black}CC 100%)`
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: colors.textSecondary }}>Loading…</div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                overflowX: "auto",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem"
              }}
            >
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  data={t}
                  index={i}
                  scrollYProgress={settledProgress}
                  isActive={false}
                  isAnyActive={false}
                  isHovered={false}
                  isAnyHovered={false}
                  onHoverStart={() => {}}
                  onHoverEnd={() => {}}
                  onClick={() => {}}
                  isMobile
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", height: "100vh" }}>
      <section
        ref={sectionRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: colors.bgDark,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ position: "absolute", inset: "-8% 0", zIndex: 0 }}>
          <motion.div style={{ position: "relative", height: "116%", width: "100%", y: bgY }}>
            <img
              src={testimonialsContent.backgroundImage}
              alt={testimonialsContent.backgroundAlt}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${colors.black}CC 0%, ${colors.black}80 40%, ${colors.black}80 60%, ${colors.black}CC 100%)`
            }}
          />
        </div>

        <div style={{ flexShrink: 0, paddingTop: "clamp(4.5rem, 7vw, 6rem)", position: "relative", zIndex: 2 }}>
          <TestimonialsScrollTracker progressMV={scrollYProgress} />
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
            paddingTop: "clamp(1rem, 2vw, 1.75rem)",
            paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            position: "relative",
            zIndex: showBackdrop ? 50 : 2
          }}
        >
          <motion.div
            ref={trackRef}
            style={{
              x: trackX,
              display: "flex",
              alignItems: "stretch",
              paddingLeft: "clamp(2rem, 6vw, 6rem)",
              paddingRight: "clamp(6rem, 12vw, 14rem)",
              willChange: "transform"
            }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t.id}
                data={t}
                index={i}
                scrollYProgress={scrollYProgress}
                isActive={activeId === t.id}
                isAnyActive={isActiveMode}
                isHovered={hoveredId === t.id}
                isAnyHovered={isHoverMode}
                onHoverStart={() => handleHoverStart(t.id)}
                onHoverEnd={handleHoverEnd}
                onClick={() => handleClick(t.id)}
              />
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {showBackdrop && (
            <motion.div
              key={isActiveMode ? "active" : "hover"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isActiveMode ? 0.35 : 0.2 }}
              onClick={() => {
                setActiveId(null);
                setHoveredId(null);
              }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: isActiveMode ? "rgba(5,9,20,0.88)" : "rgba(5,9,20,0.62)",
                backdropFilter: `blur(${isActiveMode ? 8 : 12}px)`,
                WebkitBackdropFilter: `blur(${isActiveMode ? 8 : 12}px)`,
                zIndex: 30,
                cursor: isActiveMode ? "pointer" : "default"
              }}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
