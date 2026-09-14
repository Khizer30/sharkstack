import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FlowSection({ children, className = "", style = {}, "aria-label": ariaLabel }) {
  return (
    <section data-flow-section aria-label={ariaLabel} className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      <div
        data-flow-inner
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 pt-[clamp(2rem,8vw,4vw)] pb-[4vw] will-change-transform"
        style={{ transformOrigin: "bottom left", paddingLeft: "clamp(1.25rem, 6vw, 3rem)", paddingRight: "clamp(1.25rem, 6vw, 3rem)", ...style }}
      >
        {children}
      </div>
    </section>
  );
}

export default function FlowArt({ children, className = "", "aria-label": ariaLabel = "Services" }) {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const sections = Array.from(containerRef.current.querySelectorAll("[data-flow-section]"));
      if (sections.length === 0) return;

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 10 });

        const inner = section.querySelector(".flow-art-container");
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" });
          gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true
            }
          });
        }

        if (i < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: "bottom bottom",
            end: "bottom top",
            pin: true,
            pinSpacing: false
          });
        }
      });

      ScrollTrigger.refresh();
    }, containerRef);
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <main ref={containerRef} aria-label={ariaLabel} className={`w-full overflow-x-hidden ${className}`}>
      {children}
    </main>
  );
}
