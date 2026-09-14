import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/colors";

const lerp = (a, b, t) => a + (b - a) * t;

export default function MagneticCursor({
  children,
  containerRef,
  magneticFactor = 0.4,
  lerpAmount = 0.15,
  hoverPadding = 12,
  hoverAttribute = "data-magnetic",
  cursorSize = 20,
  cursorColor = colors.white,
  blendMode = "exclusion",
  shape = "circle",
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
  zIndex = 50,
  snapZIndex = 1
}) {
  const cursorRef = useRef(null);
  const stateRef = useRef(null);
  const [isTouchDevice] = useState(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);

  const configRef = useRef({ magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding });
  useEffect(() => {
    configRef.current = { magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding };
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding]);

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;
    const cursorEl = cursorRef.current;
    const container = containerRef?.current;
    if (!cursorEl || !container) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const detachDuration = prefersReducedMotion ? 0.1 : 0.35;

    const state = {
      pos: {
        current: { x: -100, y: -100 },
        target: { x: -100, y: -100 },
        previous: { x: -100, y: -100 }
      },
      hover: { isHovered: false },
      isDetaching: false
    };
    stateRef.current = state;

    const shapeBorderRadius = shape === "circle" ? "50%" : shape === "square" ? "0" : "8px";

    const update = () => {
      if (state.hover.isHovered) return;
      const { speedMultiplier, maxScaleX, maxScaleY, lerpAmount } = configRef.current;
      const effectiveLerp = prefersReducedMotion ? 1 : lerpAmount;

      state.pos.current.x = lerp(state.pos.current.x, state.pos.target.x, effectiveLerp);
      state.pos.current.y = lerp(state.pos.current.y, state.pos.target.y, effectiveLerp);
      const dx = state.pos.current.x - state.pos.previous.x;
      const dy = state.pos.current.y - state.pos.previous.y;
      state.pos.previous.x = state.pos.current.x;
      state.pos.previous.y = state.pos.current.y;

      if (state.isDetaching) {
        gsap.set(cursorEl, { x: state.pos.current.x, y: state.pos.current.y, scaleX: 1, scaleY: 1, rotate: 0, overwrite: "auto" });
      } else {
        const speed = Math.sqrt(dx * dx + dy * dy) * speedMultiplier;
        gsap.set(cursorEl, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          rotate: Math.atan2(dy, dx) * (180 / Math.PI),
          scaleX: 1 + Math.min(speed, maxScaleX),
          scaleY: 1 - Math.min(speed, maxScaleY),
          overwrite: "auto"
        });
      }
    };

    const initializePosition = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onPointerMove = (event) => {
      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;
    };

    const onPointerEnter = (event) => {
      initializePosition(event);
      gsap.to(cursorEl, { opacity: 1, duration: 0.3 });
    };

    const onPointerLeave = () => {
      gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
    };

    gsap.ticker.add(update);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    const cleanupFunctions = [];
    const magneticElements = Array.from(container.querySelectorAll(`[${hoverAttribute}]`));

    magneticElements.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const handlePointerEnter = () => {
        const { magneticFactor, hoverPadding } = configRef.current;
        state.hover.isHovered = true;
        state.isDetaching = false;

        const bounds = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        const magneticColor = el.getAttribute("data-magnetic-color") || cursorColor;
        const dynamicPadding = hoverPadding * (1 + magneticFactor);
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        gsap.set(cursorEl, { zIndex: snapZIndex });
        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          x: centerX,
          y: centerY,
          width: bounds.width + dynamicPadding * 2,
          height: bounds.height + dynamicPadding * 2,
          borderRadius: computedStyle.borderRadius,
          backgroundColor: magneticColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "all"
        });
      };

      const handlePointerLeave = () => {
        const currentX = gsap.getProperty(cursorEl, "x");
        const currentY = gsap.getProperty(cursorEl, "y");

        state.pos.current.x = currentX;
        state.pos.current.y = currentY;
        state.pos.previous.x = currentX;
        state.pos.previous.y = currentY;

        state.hover.isHovered = false;
        state.isDetaching = true;

        const { cursorSize } = configRef.current;

        gsap.set(cursorEl, { zIndex });
        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          width: cursorSize,
          height: cursorSize,
          borderRadius: shapeBorderRadius,
          backgroundColor: cursorColor,
          scaleX: 1,
          scaleY: 1,
          duration: detachDuration,
          ease: "power3.out",
          overwrite: "all",
          onComplete: () => {
            state.isDetaching = false;
          }
        });
      };

      let rafId = null;
      const handlePointerMoveOnEl = (event) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const { clientX, clientY } = event;
          const { height, width, left, top } = el.getBoundingClientRect();
          const { magneticFactor } = configRef.current;
          xTo((clientX - (left + width / 2)) * magneticFactor);
          yTo((clientY - (top + height / 2)) * magneticFactor);
          rafId = null;
        });
      };

      const handlePointerOut = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointerenter", handlePointerEnter);
      el.addEventListener("pointerleave", handlePointerLeave);
      el.addEventListener("pointermove", handlePointerMoveOnEl);
      el.addEventListener("pointerout", handlePointerOut);

      cleanupFunctions.push(() => {
        el.removeEventListener("pointerenter", handlePointerEnter);
        el.removeEventListener("pointerleave", handlePointerLeave);
        el.removeEventListener("pointermove", handlePointerMoveOnEl);
        el.removeEventListener("pointerout", handlePointerOut);
      });
    });

    return () => {
      gsap.ticker.remove(update);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [disableOnTouch, isTouchDevice, containerRef, hoverAttribute, cursorColor, shape, zIndex, snapZIndex]);

  if (disableOnTouch && isTouchDevice) return children;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          top: 0,
          left: 0,
          zIndex,
          willChange: "transform, width, height, border-radius",
          backgroundColor: cursorColor,
          mixBlendMode: blendMode,
          width: cursorSize,
          height: cursorSize,
          borderRadius: shape === "circle" ? "50%" : shape === "square" ? "0" : "8px",
          backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
          WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none"
        }}
      />
      {children}
    </>
  );
}
