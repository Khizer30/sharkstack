import { Suspense, useEffect, useRef, useState } from "react";

export default function DeferredMount({ children, minHeight = "60vh", rootMargin = "1500px 0px" }) {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => window.__lenis?.resize());
    });
    ro.observe(el);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return <div ref={ref} style={{ minHeight }} />;
  }

  return (
    <div ref={ref}>
      <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>
    </div>
  );
}
