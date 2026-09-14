import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { parallaxBannerContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function ParallaxBanner({
  content = parallaxBannerContent,
  ctaLabel = "Discover our services",
  ctaTarget = "services",
  showOverlay = true,
  rounded = true
}) {
  const containerRef = useRef(null);
  const { transitionToSection } = usePageTransition();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className={`mx-2 my-10 overflow-hidden ${rounded ? "rounded-[2rem]" : ""}`}>
      <div
        ref={containerRef}
        className="relative flex h-[80vh] items-center justify-center overflow-hidden"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {showOverlay && (
          <>
            <div className="relative z-10 flex h-full w-full flex-col justify-end p-8 md:p-20" style={{ mixBlendMode: "difference" }}>
              <p className="text-4xl md:text-[5vw] uppercase" style={{ ...fonts.poppinsBold, color: colors.white }}>
                {content.heading}
              </p>
            </div>

            <button
              type="button"
              onClick={() => transitionToSection(ctaTarget)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-20 inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.8rem",
                color: colors.white,
                backgroundColor: `${colors.black}66`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${colors.white}33`,
                padding: "0.3rem 0.3rem 0.3rem 1rem",
                gap: "0.6rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.black}66`;
              }}
            >
              {ctaLabel}
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "1.75rem", height: "1.75rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
              >
                <ArrowRight size={13} />
              </span>
            </button>
          </>
        )}

        <div className="fixed top-[-10vh] left-0 h-[120vh] w-full pointer-events-none">
          <motion.div className="relative h-full w-full" style={{ y }}>
            <img src={content.image} alt={content.alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
