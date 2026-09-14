export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Animation math utils ────────────────────────────────────────────────────
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeIn = (t) => t * t * t;
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function seedRng(n) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

// ─── Nav section scrolling ───────────────────────────────────────────────────
export function scrollToId(id, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window["__lenis"];
  if (lenis) {
    // Recalculate content height first — important right after a route change,
    // where Lenis may still be holding onto the previous page's shorter document.
    lenis.resize();
    lenis.scrollTo(el, { offset: -120, immediate });
  } else {
    el.scrollIntoView({
      behavior: immediate ? "auto" : "smooth",
      block: "start"
    });
  }
}

export function waitForStableSection(id, onReady, { timeout = 3000 } = {}) {
  const deadline = performance.now() + timeout;
  let lastTop = -1;
  let stableFrames = 0;

  const check = () => {
    const el = document.getElementById(id);
    const top = el ? el.getBoundingClientRect().top + window.scrollY : -1;
    stableFrames = el && top === lastTop ? stableFrames + 1 : 0;
    lastTop = top;

    if ((el && stableFrames >= 4) || performance.now() >= deadline) {
      onReady();
    } else {
      requestAnimationFrame(check);
    }
  };

  requestAnimationFrame(check);
}

export function navigateToSection(to, navigate, pathname, transitionTo, transitionToSection) {
  if (!to.startsWith("#")) {
    if (transitionTo) {
      transitionTo(to);
    } else {
      navigate(to);
    }
    return;
  }

  const id = to.slice(1);
  if (transitionToSection) {
    transitionToSection(id);
    return;
  }

  if (pathname !== "/") {
    navigate("/");
    waitForStableSection(id, () => scrollToId(id));
  } else {
    scrollToId(id);
  }
}
