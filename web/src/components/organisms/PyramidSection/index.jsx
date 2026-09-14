import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/assets/svgs";
import AsciiPyramid from "@/components/atoms/AsciiPyramid";
import { DotSphere } from "@/components/atoms/DotSphere";
import PhraseText from "@/components/molecules/PyramidSection/PhraseText";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { pyramidPhrases } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { useIsMobile } from "@/hooks/useIsMobile";

const BG_STOPS = [colors.secondary, colors.secondary, colors.pyramidBg1, colors.pyramidBg2, colors.black];

const MOBILE_ROTATE_SPEED = 0.35;

export default function PyramidSection() {
  const wrapperRef = useRef(null);
  const mobileWrapperRef = useRef(null);
  const [theta, setTheta] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const isMobile = useIsMobile();
  const { transitionTo } = usePageTransition();

  useEffect(() => {
    if (!isMobile) return;
    const el = mobileWrapperRef.current;
    if (!el) return;

    let animId = 0;
    let isVisible = true;
    let last = performance.now();

    const tick = (now) => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      setTheta((prev) => prev + delta * MOBILE_ROTATE_SPEED);
      animId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        last = performance.now();
        animId = requestAnimationFrame(tick);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  const thetaMotion = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const phraseMotion = useTransform(scrollYProgress, [0, 1], [0, pyramidPhrases.length - 0.01]);

  const rafId = useRef(null);
  useMotionValueEvent(thetaMotion, "change", () => {
    if (isMobile || rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      setTheta(thetaMotion.get());
      rafId.current = null;
    });
  });
  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    },
    []
  );
  useMotionValueEvent(phraseMotion, "change", (v) => {
    if (!isMobile) setPhraseIdx(Math.floor(v));
  });

  const bg = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], BG_STOPS);

  const { line1, accent, line2, sub } = pyramidPhrases[phraseIdx];

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr",
    gridTemplateRows: isMobile ? "auto 1fr" : undefined,
    alignItems: "center",
    padding: isMobile ? "clamp(1.5rem, 8vh, 3rem) 1.5rem 2rem" : "0 clamp(2rem, 6vw, 7rem)",
    gap: isMobile ? "1rem" : "clamp(2rem, 4vw, 4rem)",
    overflow: "hidden"
  };

  if (isMobile) {
    return (
      <div ref={mobileWrapperRef} style={{ ...gridStyle, height: "100vh", background: BG_STOPS[0], position: "relative" }}>
        <DotSphere
          dotGap={22}
          sphereRadius={200}
          dotRadiusMax={2.5}
          speed={0.18}
          bgColor={colors.black}
          dotColor={colors.primary}
          followMouse={true}
          style={{ mixBlendMode: "screen", position: "absolute", inset: 0, zIndex: 0 }}
        />

        <div style={{ position: "relative", zIndex: 1, order: isMobile ? 2 : 0 }}>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: colors.primary,
              display: "block",
              marginBottom: "1.5rem"
            }}
          >
            About us
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIdx}
              exit={{
                opacity: 0,
                y: -24,
                filter: "blur(6px)",
                transition: { duration: 0.22, ease: "easeIn" }
              }}
            >
              <PhraseText line1={line1} accent={accent} line2={line2} />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                style={{
                  ...fonts.poppinsMedium,
                  fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                  color: `${colors.white}66`,
                  lineHeight: 1.75,
                  marginTop: "1.5rem",
                  maxWidth: "28rem"
                }}
              >
                {sub}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => transitionTo("/portfolio")}
            className="inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
            style={{
              ...fonts.montSemiBold,
              fontSize: "1.05rem",
              color: colors.white,
              backgroundColor: `${colors.white}1A`,
              border: "none",
              padding: "0.5rem 0.5rem 0.5rem 1.5rem",
              gap: "0.9rem",
              marginTop: "2rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.white}1A`;
            }}
          >
            Learn more
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
            >
              <ArrowRight size={18} />
            </span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            order: 1,
            minHeight: 0,
            overflow: "hidden"
          }}
        >
          <AsciiPyramid theta={theta} axis="y" edges={false} color step={0.012} />
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ height: "350vh", position: "relative" }}>
      <motion.div style={{ ...gridStyle, position: "sticky", top: 0, height: "100vh", background: bg }}>
        <DotSphere
          dotGap={22}
          sphereRadius={200}
          dotRadiusMax={2.5}
          speed={0.18}
          bgColor={colors.black}
          dotColor={colors.primary}
          followMouse={true}
          style={{ mixBlendMode: "screen", position: "absolute", inset: 0, zIndex: 0 }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: colors.primary,
              display: "block",
              marginBottom: "1.5rem"
            }}
          >
            About us
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIdx}
              exit={{
                opacity: 0,
                y: -24,
                filter: "blur(6px)",
                transition: { duration: 0.22, ease: "easeIn" }
              }}
            >
              <PhraseText line1={line1} accent={accent} line2={line2} />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                style={{
                  ...fonts.poppinsMedium,
                  fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                  color: `${colors.white}66`,
                  lineHeight: 1.75,
                  marginTop: "1.5rem",
                  maxWidth: "28rem"
                }}
              >
                {sub}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => transitionTo("/portfolio")}
            className="inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
            style={{
              ...fonts.montSemiBold,
              fontSize: "1.05rem",
              color: colors.white,
              backgroundColor: `${colors.white}1A`,
              border: "none",
              padding: "0.5rem 0.5rem 0.5rem 1.5rem",
              gap: "0.9rem",
              marginTop: "2rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.white}1A`;
            }}
          >
            Learn more
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
            >
              <ArrowRight size={18} />
            </span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            order: 0
          }}
        >
          <AsciiPyramid theta={theta} axis="y" edges={false} color step={0.008} />
        </div>
      </motion.div>
    </div>
  );
}
