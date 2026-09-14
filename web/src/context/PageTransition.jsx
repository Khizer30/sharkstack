import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { colors } from "@/constants/colors";
import { scrollToId, waitForStableSection } from "@/utils/helpers";

const Ctx = createContext(null);

export function usePageTransition() {
  return useContext(Ctx);
}

const DOWN_MS = 580;
const UP_MS = 600;
const DELAY_MS = 40;

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeIn(t) {
  return t * t * t;
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function makePath(revealedH, curveDepth) {
  const w = window.innerWidth;
  return [`M 0,0`, `L ${w},0`, `L ${w},${revealedH}`, `C ${w * 0.72},${revealedH + curveDepth} ${w * 0.28},${revealedH + curveDepth} 0,${revealedH}`, `Z`].join(
    " "
  );
}

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);
  const rafRef = useRef(null);
  const curtainDownRef = useRef(false);
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  const cancelRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateCurtain = useCallback((direction, duration, onDone) => {
    cancelRaf();
    const el = overlayRef.current;
    if (!el) {
      onDone?.();
      return;
    }
    const h = window.innerHeight;

    el.style.display = "block";
    el.style.clipPath = `path('${makePath(direction === "down" ? 0 : h, 0)}')`;

    const start = performance.now();

    const tick = (now) => {
      const raw = Math.min((now - start) / duration, 1);
      const ease = easeInOut(raw);

      let revealedH, curveDepth;
      if (direction === "down") {
        revealedH = lerp(0, h, ease);
        curveDepth = lerp(0, 170, Math.sin(raw * Math.PI)); // bow downward
      } else {
        revealedH = lerp(h, 0, ease);
        curveDepth = -lerp(0, 160, Math.sin(raw * Math.PI)); // bow upward on retreat
      }

      el.style.clipPath = `path('${makePath(revealedH, curveDepth)}')`;

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        if (direction === "up") el.style.display = "none";
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const revealPage = useCallback(() => {
    // Called by the incoming page on mount — pull curtain back up.
    // No-op if the curtain isn't actually down (e.g. a plain nav link brought us here).
    if (!curtainDownRef.current) return;
    curtainDownRef.current = false;
    setTimeout(() => {
      animateCurtain("up", UP_MS, null);
    }, 60);
  }, [animateCurtain]);

  const transitionTo = useCallback(
    (path) => {
      cancelRaf();
      curtainDownRef.current = true;
      const isSamePage = pathRef.current === path;

      // Curtain sweeps DOWN → navigate → curtain pulls back UP
      animateCurtain("down", DOWN_MS, () => {
        setTimeout(() => {
          if (isSamePage) {
            // Same route: react-router won't remount the page, so nothing will
            // call revealPage() for us — pull the curtain back up ourselves.
            const lenis = window["__lenis"];
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else document.documentElement.scrollTop = 0;
            revealPage();
          } else {
            navigate(path);
          }
        }, DELAY_MS);
      });
    },
    [animateCurtain, navigate, revealPage]
  );

  const transitionToSection = useCallback(
    (id, path = "/") => {
      cancelRaf();
      curtainDownRef.current = true;
      const needsNavigate = pathRef.current !== path;

      // Curtain sweeps DOWN → (navigate to target page if needed) → scroll to section → curtain pulls back UP
      animateCurtain("down", DOWN_MS, () => {
        setTimeout(() => {
          if (needsNavigate) navigate(path);

          const scrollAndReveal = () => {
            ScrollTrigger.refresh();
            scrollToId(id, { immediate: true });
            revealPage();
          };

          if (needsNavigate) {
            // Home may still be mounting (route change, layout, Lenis re-measuring,
            // GSAP ScrollTrigger pin spacers still being computed) — wait for the
            // section to exist *and* the page's total height to settle first.
            waitForStableSection(id, scrollAndReveal);
          } else {
            scrollAndReveal();
          }
        }, DELAY_MS);
      });
    },
    [animateCurtain, navigate, revealPage]
  );

  return (
    <Ctx.Provider value={{ transitionTo, transitionToSection, revealPage }}>
      {children}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: `
            radial-gradient(ellipse 80% 60% at 62% 55%, ${colors.primary}10 0%, transparent 65%),
            radial-gradient(ellipse 30% 30% at 85% 15%, ${colors.primary}06 0%, transparent 50%),
            ${colors.black}
          `,
          clipPath: `path('${makePath(0, 0)}')`,
          display: "none",
          pointerEvents: "none"
        }}
      />
    </Ctx.Provider>
  );
}
