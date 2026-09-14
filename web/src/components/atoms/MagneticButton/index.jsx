import gsap from "gsap";
import { useRef, useEffect } from "react";

export default function MagneticButton({ as: Tag = "button", children, style, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, rotationX: -y * 0.1, rotationY: x * 0.1, scale: 1.05, ease: "power2.out", duration: 0.4 });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)", duration: 1.2 });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Tag ref={ref} style={{ cursor: "pointer", ...style }} {...props}>
      {children}
    </Tag>
  );
}
