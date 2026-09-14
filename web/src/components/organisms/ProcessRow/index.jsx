import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import videoMp4 from "@/assets/animations/video.mp4";
import { ArrowRight } from "@/assets/svgs";
import ProcessSection from "@/components/organisms/ProcessSection";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { usePageTransition } from "@/context/PageTransition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { navigateToSection } from "@/utils/helpers";

export default function ProcessRow() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const videoCardRef = useRef(null);
  const videoRef = useRef(null);
  const isMobile = useIsMobile();
  const [showBookCall, setShowBookCall] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  useEffect(() => {
    if (isMobile) return;
    let ticking = false;
    const sync = () => {
      ticking = false;
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const scrolled = Math.max(0, -outer.getBoundingClientRect().top);
      const outerRange = outer.offsetHeight - window.innerHeight;
      const progress = outerRange > 0 ? Math.min(scrolled / outerRange, 1) : 0;
      const animProg = Math.min(progress / 0.62, 1);
      inner.scrollTop = animProg * (inner.scrollHeight - inner.clientHeight);

      setShowBookCall(animProg >= 1);

      if (videoCardRef.current) {
        const t = Math.min(progress / 0.62, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const y = (1 - ease) * videoCardRef.current.offsetHeight;
        const opacity = Math.min(progress / 0.15, 1);
        videoCardRef.current.style.transform = `translateY(${y}px)`;
        videoCardRef.current.style.opacity = opacity;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (isMobile) {
    return <ProcessSection />;
  }

  return (
    <div ref={outerRef} style={{ height: "380vh", position: "relative", zIndex: 5, marginTop: "-20vh" }}>
      <div
        style={{
          position: "sticky",
          top: "12.5vh",
          display: "flex",
          gap: "1.5vw",
          paddingLeft: isMobile ? 0 : "2vw",
          paddingRight: isMobile ? 0 : "3vw",
          height: "75vh",
          alignItems: "flex-start"
        }}
      >
        <div
          style={{
            display: isMobile ? "none" : "flex",
            flexDirection: "column",
            width: "26vw",
            flexShrink: 0,
            gap: "1.25rem"
          }}
        >
          <div
            ref={videoCardRef}
            style={{
              width: "100%",
              height: "48vh",
              flexShrink: 0,
              borderRadius: "24px",
              overflow: "hidden",
              opacity: 0,
              willChange: "transform, opacity",
              boxShadow: `12px 24px 80px ${colors.black}B3`
            }}
          >
            <video ref={videoRef} src={videoMp4} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>

          <AnimatePresence>
            {showBookCall && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigateToSection("#book-call", navigate, pathname, transitionTo, transitionToSection)}
                className="inline-flex items-center self-center rounded-full transition-colors duration-300 cursor-pointer"
                style={{
                  ...fonts.montSemiBold,
                  fontSize: "1.05rem",
                  color: colors.white,
                  backgroundColor: `${colors.white}1A`,
                  border: "none",
                  padding: "0.5rem 0.5rem 0.5rem 1.5rem",
                  gap: "0.9rem"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.white}1A`;
                }}
              >
                Book a Call
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
                >
                  <ArrowRight size={18} />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ y: 80, scale: 0.97 }}
          whileInView={{ y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.01 }}
          style={{
            flex: 1,
            height: "75vh",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: `-24px -12px 80px ${colors.black}CC, 0 24px 80px ${colors.black}80`
          }}
        >
          <div ref={innerRef} className="ps-inner-scroll" style={{ height: "100%", overflowY: "scroll", scrollbarWidth: "none" }}>
            <ProcessSection />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
