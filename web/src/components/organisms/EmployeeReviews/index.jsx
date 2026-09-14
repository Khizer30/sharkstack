import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/atoms/Spinner";
import Text from "@/components/atoms/Text";
import HalftoneField from "@/components/atoms/HalftoneField";
import NavButton from "@/components/molecules/EmployeeReviews/NavButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { employeeReviewsContent } from "@/content";
import { fetchTeamMembers } from "@/store/actions/teamMemberActions";

const AUTO_ADVANCE_MS = 6000;

const wordVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }
  }),
  exit: (i) => ({
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, delay: i * 0.015 }
  })
};

export default function EmployeeReviews() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.teamMembers);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchTeamMembers());
  }, [status, dispatch]);

  const reviews = useMemo(
    () =>
      items.map((m) => ({
        id: m.id,
        quote: m.review,
        author: m.name,
        role: m.jobTitle
      })),
    [items]
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numberX = useTransform(springX, [-200, 200], [-20, 20]);
  const numberY = useTransform(springY, [-200, 200], [-10, 10]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [reviews.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActiveIndex(0);
  }, [reviews.length]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const isLoading = status === "idle" || status === "loading";
  const current = reviews[activeIndex];

  return (
    <section className="relative w-full overflow-hidden" style={{ background: colors.bgDark }}>
      <div className="relative w-full" style={{ height: "clamp(15rem, 28vw, 21rem)" }}>
        <HalftoneField dotColor={colors.primary} bg={colors.bgDark} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.bgDark}30, ${colors.bgDark}CC 70%, ${colors.bgDark})` }} />
        <div className="relative h-full flex flex-col justify-end" style={{ padding: "0 clamp(2rem, 6vw, 7rem) clamp(2rem, 4vw, 3rem)" }}>
          <Text variant="h2" as="h1" color={colors.white} style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1.05 }}>
            {employeeReviewsContent.heading}
          </Text>
        </div>
      </div>

      <div ref={containerRef} className="relative" onMouseMove={handleMouseMove} style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(2rem, 6vw, 7rem)" }}>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: colors.white }}>
            <Spinner size={18} color={colors.white} />
            <span style={{ ...fonts.montRegular, fontSize: "0.9rem", color: `${colors.white}80` }}>Loading…</span>
          </div>
        ) : reviews.length === 0 ? (
          <p style={{ ...fonts.montRegular, color: `${colors.white}50`, fontSize: "0.95rem", margin: 0 }}>No reviews available right now.</p>
        ) : (
          <>
            <motion.div
              className="absolute select-none pointer-events-none hidden md:block"
              style={{
                left: "-1rem",
                top: "50%",
                translateY: "-50%",
                x: numberX,
                y: numberY,
                ...fonts.poppinsBold,
                fontSize: "clamp(10rem, 22vw, 20rem)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: `${colors.white}08`
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div className="relative flex flex-col md:flex-row" style={{ gap: "clamp(2rem, 5vw, 4rem)" }}>
              <div className="hidden md:flex flex-col items-center" style={{ paddingRight: "clamp(2rem, 4vw, 3rem)", borderRight: `1px solid ${colors.white}15` }}>
                <span
                  style={{
                    ...fonts.montMedium,
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: `${colors.white}60`,
                    writingMode: "vertical-rl",
                    textOrientation: "mixed"
                  }}
                >
                  Reviews
                </span>
                <div className="relative w-px" style={{ height: "8rem", background: `${colors.white}15`, marginTop: "2rem" }}>
                  <motion.div
                    className="absolute top-0 left-0 w-full"
                    style={{ background: colors.primary, transformOrigin: "top" }}
                    animate={{ height: `${((activeIndex + 1) / reviews.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <div className="flex-1" style={{ minWidth: 0 }}>
                <div style={{ minHeight: "clamp(9rem, 18vw, 11rem)" }}>
                  <AnimatePresence mode="wait">
                    <blockquote
                      key={activeIndex}
                      style={{
                        ...fonts.poppinsMedium,
                        color: colors.white,
                        fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
                        lineHeight: 1.25,
                        letterSpacing: "-0.01em",
                        margin: 0
                      }}
                    >
                      {current.quote.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={wordVariants}
                          className="inline-block"
                          style={{ marginRight: "0.3em" }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </blockquote>
                  </AnimatePresence>
                </div>

                <div className="flex items-end justify-between flex-wrap" style={{ gap: "1.5rem", marginTop: "clamp(2rem, 4vw, 2.5rem)" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="flex items-center"
                      style={{ gap: "1rem" }}
                    >
                      <motion.div
                        style={{ width: "2rem", height: "1px", background: colors.white, transformOrigin: "0% 50%" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                      />
                      <div>
                        <p style={{ ...fonts.poppinsSemiBold, color: colors.white, fontSize: "1rem", margin: 0 }}>{current.author}</p>
                        <p style={{ ...fonts.montRegular, color: `${colors.white}80`, fontSize: "0.85rem", margin: "0.2rem 0 0" }}>{current.role}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center" style={{ gap: "0.75rem" }}>
                    <NavButton direction="prev" onClick={goPrev} />
                    <NavButton direction="next" onClick={goNext} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
