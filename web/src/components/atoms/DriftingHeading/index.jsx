import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function DriftingHeading({ children, className, style }) {
  const headingRef = useRef(null);
  const maxOffsetRef = useRef(0);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    gsap.fromTo(
      heading,
      { opacity: 0, y: 90, scale: 0.92, filter: "blur(8px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out", delay: 0.15 }
    );
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    const container = heading?.parentElement;
    if (!heading || !container) return;

    const measure = () => {
      const containerStyles = getComputedStyle(container);
      const paddingX = parseFloat(containerStyles.paddingLeft) + parseFloat(containerStyles.paddingRight);
      const innerWidth = container.getBoundingClientRect().width - paddingX;
      const headingWidth = heading.getBoundingClientRect().width;
      maxOffsetRef.current = Math.max(0, (innerWidth - headingWidth) / 2);
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);

    const moveTo = gsap.quickTo(heading, "x", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e) => {
      const ratio = (e.clientX / window.innerWidth) * 2 - 1;
      moveTo(ratio * maxOffsetRef.current);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <h1 ref={headingRef} className={className} style={style}>
      {children}
    </h1>
  );
}
