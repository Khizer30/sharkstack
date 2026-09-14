import createGlobe from "cobe";
import { useEffect, useRef, useCallback } from "react";
import { colors } from "@/constants/colors";

const requestIdle =
  typeof window !== "undefined" && window.requestIdleCallback ? window.requestIdleCallback : (cb) => setTimeout(() => cb({ didTimeout: true }), 1);

const cancelIdle = typeof window !== "undefined" && window.cancelIdleCallback ? window.cancelIdleCallback : clearTimeout;

function hexToRgbArray(hex, brightness = 1) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.min(1, v);
  return [clamp((((n >> 16) & 255) / 255) * brightness), clamp((((n >> 8) & 255) / 255) * brightness), clamp(((n & 255) / 255) * brightness)];
}

export function GlobePulse({ markers = [], speed = 0.003, className = "" }) {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000
        };
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let globe = null;
    let animId;
    let initFrame = null;
    let idleId = null;
    let ro = null;
    let cancelled = false;
    let isVisible = true;
    let phi = 0;
    let frameCount = 0;

    function animate() {
      if (cancelled || !isVisible) {
        animId = 0;
        return;
      }
      frameCount++;
      const dragging = pointerInteracting.current !== null;
      if (dragging || frameCount % 2 === 0) {
        if (!isPausedRef.current) phi += speed * (dragging ? 1 : 2);
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta
        });
      }
      animId = requestAnimationFrame(animate);
    }

    function start() {
      const width = canvas.offsetWidth;
      if (cancelled || width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 2.2,
        mapSamples: 6000,
        mapBrightness: 6.5,
        baseColor: hexToRgbArray(colors.chart5),
        markerColor: hexToRgbArray(colors.primary),
        glowColor: hexToRgbArray(colors.chart5, 0.5),
        markers: markers.map((m) => ({ location: m.location, size: 0.05 }))
      });

      animate();
      setTimeout(() => {
        if (canvas && !cancelled) canvas.style.opacity = "1";
      });
    }

    function init() {
      idleId = requestIdle(
        () => {
          initFrame = requestAnimationFrame(start);
        },
        { timeout: 800 }
      );
    }

    let hasStarted = false;
    const tryStart = () => {
      if (hasStarted || canvas.offsetWidth === 0) return;
      hasStarted = true;
      init();
    };

    if (canvas.offsetWidth === 0) {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          tryStart();
        }
      });
      ro.observe(canvas);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          tryStart();
          if (!animId && globe) animate();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId) cancelIdle(idleId);
      if (initFrame) cancelAnimationFrame(initFrame);
      if (ro) ro.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none"
        }}
      />
    </div>
  );
}
