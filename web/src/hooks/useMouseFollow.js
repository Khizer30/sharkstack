import gsap from "gsap";
import { useEffect, useRef } from "react";

export function useMouseFollow(elementRef, containerRef, options = {}) {
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const { edgeBuffer = 0, bottomBuffer = 0 } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    const container = containerRef?.current || document.body;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();

      let targetX = e.clientX - rect.left;
      let targetY = e.clientY - rect.top;

      const elRect = elementRef.current.getBoundingClientRect();
      const elWidth = elRect.width;
      const elHeight = elRect.height;
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      targetX = Math.max(-edgeBuffer, Math.min(targetX, containerWidth - elWidth + edgeBuffer));
      targetY = Math.max(-edgeBuffer, Math.min(targetY, containerHeight - elHeight - bottomBuffer));

      mouse.current.x = targetX;
      mouse.current.y = targetY;
    };

    container.addEventListener("mousemove", handleMouseMove);

    const setXY = gsap.quickSetter(elementRef.current, "css");

    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      setXY({ x: pos.current.x, y: pos.current.y });
    };

    gsap.ticker.add(tick);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tick);
    };
  }, [elementRef, containerRef, edgeBuffer, bottomBuffer]);
}
