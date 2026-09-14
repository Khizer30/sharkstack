import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useEffect, useMemo } from "react";
import { colors } from "@/constants/colors";
import { COLS, ROWS, MOB_TOP, MOB_H, MOB_L, MOB_CW, MOB_CH, PHASE1, PHASE2, PHASE3 } from "@/constants/projectDetail";
import { seedRng, clamp01, lerp, easeIn, easeOut, easeInOut } from "@/utils/helpers";

const CYL_R = 290;
const ANGLE_STEP = 0.3;

function buildBlocks(imgX, imgY, getCenter, scaleMin, scaleRange, distMin, distRange, staggerDiv) {
  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const r1 = seedRng(i * 17 + 3),
      r2 = seedRng(i * 29 + 7);
    const r3 = seedRng(i * 43 + 11),
      r4 = seedRng(i * 53 + 13),
      r5 = seedRng(i * 61 + 17);
    const [cx, cy] = getCenter(col, row);
    const scatterX = imgX - cx + (r1 * 2 - 1) * 8;
    const scatterY = imgY - cy + (r2 * 2 - 1) * 8;
    const scatterScale = scaleMin + r3 * scaleRange;
    const angle = r4 * Math.PI * 2;
    const explodeDist = distMin + r5 * distRange;
    const explodeX = Math.cos(angle) * explodeDist * 0.75;
    const explodeY = Math.sin(angle) * explodeDist;
    const dist = Math.sqrt((cx - imgX) ** 2 + (cy - imgY) ** 2);
    return { col, row, scatterX, scatterY, scatterScale, explodeX, explodeY, stagger: (dist / staggerDiv) * 0.04 };
  });
}

export function useProjectScroll({ project, isMobile }) {
  const containerRef = useRef(null);
  const wrapRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const blockRefs = useRef([]);
  const imageWrapRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const detailRef = useRef(null);
  const techRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const toolsRef = useRef(null);
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const blocks = useMemo(() => buildBlocks(50, 84, (col, row) => [col * 25 + 12.5, (row * 100) / 3 + 100 / 6], 0.28, 0.22, 55, 55, 120), []);

  const mobileBlocks = useMemo(() => {
    const imgX = MOB_L + (MOB_CW * COLS) / 2;
    const imgY = MOB_TOP + MOB_H / 2;
    return buildBlocks(imgX, imgY, (col, row) => [MOB_L + col * MOB_CW + MOB_CW / 2, MOB_TOP + row * MOB_CH + MOB_CH / 2], 0.22, 0.2, 40, 40, 80);
  }, []);

  useEffect(() => {
    const el = nameRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const fit = () => {
      el.style.fontSize = "22vw";
      requestAnimationFrame(() => {
        while (el.scrollWidth > wrap.offsetWidth && parseFloat(el.style.fontSize) > 3) el.style.fontSize = parseFloat(el.style.fontSize) - 0.2 + "vw";
      });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [project]);

  const { scrollYProgress } = useScroll({ target: containerRef });

  const phase1Progress = useTransform(scrollYProgress, (v) => clamp01(v / PHASE1));
  const phase2Progress = useTransform(scrollYProgress, (v) => clamp01((v - PHASE1) / (PHASE2 - PHASE1)));
  const phase3Progress = useTransform(scrollYProgress, (v) => clamp01((v - PHASE2) / (PHASE3 - PHASE2)));
  const phase4Progress = useTransform(scrollYProgress, (v) => clamp01((v - PHASE3) / (1 - PHASE3)));
  const progressBarHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const nameScaleEnd = isMobile ? 0.38 : 0.12;
  const nameScale = useTransform(phase1Progress, [0, 0.18, 1], [1, nameScaleEnd, nameScaleEnd]);
  const heroTextY = useTransform(phase1Progress, [0, 0.05, 0.26, 1], ["0vh", "0vh", "-52vh", "-52vh"]);
  const heroTextOpacity = useTransform(phase1Progress, [0, 0.08, 0.26, 1], [1, 1, 0, 0]);
  const heroTextScale = useTransform(phase1Progress, [0, 0.06, 0.26, 1], [1, 1, 0.93, 0.93]);
  const heroTextFilter = useTransform(phase1Progress, [0, 0.07, 0.26, 1], ["blur(0px)", "blur(0px)", "blur(16px)", "blur(16px)"]);
  const mobileTextY = useTransform(phase1Progress, [0, 0.3, 1], ["0vh", "-6vh", "-6vh"]);
  const hasVideo = Boolean(project.video);
  const heroImageOpacity = useTransform(phase1Progress, [0, 0.05, 0.1, 1], [1, 1, 0, 0]);

  const onPhase1 = (p) => {
    const videoFade = hasVideo ? clamp01((p - 0.62) / 0.18) : 0;
    const activeBlocks = isMobileRef.current ? mobileBlocks : blocks;

    blockRefs.current.forEach((el, i) => {
      if (!el) return;
      const b = activeBlocks[i];
      const breakP = easeIn(clamp01((p - (0.05 + b.stagger * 0.5)) / 0.26));
      const assembleP = easeInOut(clamp01((p - (0.38 + b.stagger)) / 0.28));
      const ox = lerp(lerp(b.scatterX, b.explodeX, breakP), 0, assembleP);
      const oy = lerp(lerp(b.scatterY, b.explodeY, breakP), 0, assembleP);
      const sc = lerp(lerp(b.scatterScale, 0.65, breakP), 1, assembleP);
      el.style.transform = `translate(${ox}vw, ${oy}vh) scale(${sc})`;
      el.style.opacity = String(breakP * (1 - videoFade));
    });

    const vEl = videoWrapRef.current;
    if (vEl) vEl.style.opacity = String(videoFade);
  };

  const onPhase2 = (p2) => {
    const mob = isMobileRef.current;
    const vEl = videoWrapRef.current;
    const iEl = imageWrapRef.current;

    if (mob) {
      if (vEl) vEl.style.opacity = String(1 - easeOut(clamp01(p2 / 0.35)));
      const drawer = mobileDrawerRef.current;
      if (drawer) {
        const slideT = easeInOut(clamp01(p2 / 0.48));
        drawer.style.transform = `translateX(${lerp(100, 0, slideT)}%)`;
      }
    } else {
      const t = easeInOut(clamp01((p2 - 0.08) / 0.44));
      if (vEl) {
        vEl.style.transform = `translateX(${lerp(0, -25, t)}vw) scale(${lerp(1, 0.48, t)})`;
        vEl.style.borderRadius = `${lerp(0, 20, t)}px`;
      }
      // Mirror the video's recenter/shrink so no-video projects get the same
      // choreography using the still-assembled image mosaic instead.
      if (iEl) {
        iEl.style.transform = `translateX(${lerp(0, -25, t)}vw) scale(${lerp(1, 0.48, t)})`;
        iEl.style.borderRadius = `${lerp(0, 20, t)}px`;
      }
      const dEl = detailRef.current;
      if (dEl) {
        const t2 = easeInOut(clamp01((p2 - 0.05) / 0.48));
        dEl.style.transform = `translateX(${lerp(100, 0, t2)}%)`;
        dEl.style.opacity = "1";
        dEl.style.pointerEvents = t2 > 0.9 ? "auto" : "none";

        const dividerEl = dEl.querySelector("[data-ps-divider]");
        const bodyEl = dEl.querySelector("[data-ps-body]");
        const divT = easeOut(clamp01((p2 - 0.52) / 0.24));
        const bodT = easeOut(clamp01((p2 - 0.6) / 0.3));
        if (dividerEl) {
          dividerEl.style.opacity = String(divT);
          dividerEl.style.transform = `scaleX(${divT})`;
        }
        if (bodyEl) {
          bodyEl.style.opacity = String(bodT);
          bodyEl.style.transform = `translateY(${lerp(14, 0, bodT)}px)`;
        }
      }
    }

    const wEl = wrapRef.current;
    if (wEl) wEl.style.opacity = String(1 - easeOut(clamp01((p2 - 0.08) / 0.28)));

    if (mob) {
      const descEl = descRef.current;
      if (descEl) descEl.style.opacity = String(1 - easeOut(clamp01(p2 / 0.25)));
    }
  };

  const onPhase3 = (p3) => {
    const mob = isMobileRef.current;
    const vEl = videoWrapRef.current;
    const iEl = imageWrapRef.current;

    if (!mob) {
      const dEl = detailRef.current;
      if (dEl) {
        const closeT = easeInOut(clamp01(p3 / 0.32));
        dEl.style.transform = `translateX(${lerp(0, 100, closeT)}%)`;
        dEl.style.pointerEvents = "none";
      }

      const recenterT = easeInOut(clamp01((p3 - 0.06) / 0.34));
      const videoFadeT = easeOut(clamp01((p3 - 0.44) / 0.26));
      if (vEl) {
        vEl.style.transform = `translateX(${lerp(-25, 0, recenterT)}vw) scale(${lerp(0.48, 0.7, recenterT)})`;
        vEl.style.borderRadius = "20px";
        vEl.style.opacity = String(1 - videoFadeT);
      }
      if (iEl) {
        iEl.style.transform = `translateX(${lerp(-25, 0, recenterT)}vw) scale(${lerp(0.48, 0.7, recenterT)})`;
        iEl.style.borderRadius = "20px";
        iEl.style.opacity = String(1 - videoFadeT);
      }
    }

    const tEl = mob ? mobileDrawerRef.current : techRef.current;
    if (!tEl) return;

    if (!mob) {
      const sweepT = easeInOut(clamp01((p3 - 0.28) / 0.36));
      if (sweepT === 0) {
        tEl.style.clipPath = "inset(100% 0 0 0)";
      } else {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const revealTop = lerp(h, 0, sweepT);
        const curveDepth = lerp(0, 240, Math.sin(sweepT * Math.PI));
        tEl.style.clipPath = `path('M 0,${revealTop} C ${w * 0.28},${revealTop - curveDepth} ${w * 0.72},${revealTop - curveDepth} ${w},${revealTop} L ${w},${h} L 0,${h} Z')`;
      }
      tEl.style.opacity = "1";
      tEl.style.pointerEvents = sweepT > 0.5 ? "auto" : "none";

      const headEl = tEl.querySelector("[data-cap-heading]");
      if (headEl) {
        const hT = easeOut(clamp01((p3 - 0.64) / 0.14));
        headEl.style.opacity = String(hT);
        headEl.style.transform = `translateY(${lerp(20, 0, hT)}px)`;
      }
    }

    const items = tEl.querySelectorAll("[data-tech-item]");
    const numItems = items.length;

    items.forEach((item, i) => {
      const enterT = easeOut(clamp01((p3 - 0.64 - i * 0.025) / 0.1));
      if (mob) {
        item.style.opacity = String(enterT);
        item.style.transform = enterT < 1 ? `translateX(${lerp(28, 0, enterT)}px)` : "translateX(0px)";
      } else {
        item.style.opacity = String(enterT);
        item.style.transform = `translateY(calc(-50% + ${CYL_R * Math.sin(ANGLE_STEP * i)}px))`;
      }
    });

    const hlStart = mob ? 0.38 : 0.72;
    if (p3 < hlStart || numItems === 0) return;

    const hl = clamp01((p3 - hlStart) / (1 - hlStart));
    const activePos = hl * (numItems - 1);
    const endRevealT = mob ? easeInOut(clamp01((p3 - 0.88) / 0.12)) : easeInOut(clamp01((p3 - 0.97) / 0.03));

    items.forEach((item, i) => {
      const dist = Math.abs(activePos - i);
      const brightT = easeInOut(clamp01(1 - dist));
      const blurAmt = lerp(0, 2.5, easeInOut(clamp01(dist - 0.3))) * (1 - endRevealT);
      const isActive = dist < 0.55;
      const textEl = item.querySelector("[data-text]");
      const numEl = item.querySelector("[data-num]");

      if (mob) {
        const barEl = item.querySelector("[data-active-bar]");
        const textOpacity = lerp(lerp(0.25, 1, brightT), 1, endRevealT);
        const numOpacity = lerp(lerp(0.15, 0.9, brightT), 1, endRevealT);
        if (textEl) textEl.style.color = `rgba(255,255,255,${textOpacity})`;
        if (numEl) numEl.style.color = isActive && endRevealT < 0.5 ? colors.primary : `rgba(255,255,255,${numOpacity})`;
        if (barEl) barEl.style.opacity = isActive && endRevealT < 0.5 ? "1" : "0";
        item.style.background = isActive && endRevealT < 0.5 ? `${colors.primary}12` : "transparent";
        item.style.filter = `blur(${blurAmt}px)`;
        item.style.opacity = "1";
      } else {
        const ang = ANGLE_STEP * (i - activePos);
        const baseS = lerp(0.7, 1.0, easeInOut(clamp01(1 - dist * 0.5)));
        const scaleX = Math.max(0.75, Math.cos(ang)) * baseS;
        item.style.transform = `translateY(calc(-50% + ${CYL_R * Math.sin(ang)}px)) scale(${scaleX}, ${baseS})`;
        item.style.filter = `blur(${blurAmt}px)`;
        item.style.opacity = "1";
        if (textEl) textEl.style.color = isActive ? colors.white : `rgba(255,255,255,${lerp(0.14, 0.55, brightT) * (1 - endRevealT) + endRevealT})`;
        if (numEl) numEl.style.opacity = isActive && endRevealT < 0.5 ? "1" : "0";
      }
    });
  };

  const onPhase4 = (p4) => {
    const mob = isMobileRef.current;
    const toolsEl = toolsRef.current;
    const capEl = mob ? mobileDrawerRef.current : techRef.current;

    if (capEl) {
      if (mob) {
        capEl.style.transform = `translateX(${lerp(0, 100, easeInOut(clamp01(p4 / 0.22)))}%)`;
      } else {
        capEl.style.opacity = String(1 - easeOut(clamp01(p4 / 0.16)));
      }
    }

    if (!toolsEl) return;

    toolsEl.style.pointerEvents = p4 > 0 ? "auto" : "none";

    if (p4 === 0) {
      toolsEl.style.clipPath = "inset(0 0 100% 0)";
    } else {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const sweepT = easeInOut(clamp01(p4 / 0.44));
      const revealedH = lerp(0, h, sweepT);
      const curveDepth = lerp(0, 160, Math.sin(sweepT * Math.PI));
      toolsEl.style.clipPath = `path('M 0,0 L ${w},0 L ${w},${revealedH} C ${w * 0.72},${revealedH + curveDepth} ${w * 0.28},${revealedH + curveDepth} 0,${revealedH} Z')`;
    }

    const headEl = toolsEl.querySelector("[data-tools-head]");
    if (headEl) {
      const hT = easeOut(clamp01((p4 - 0.38) / 0.2));
      headEl.style.opacity = String(hT);
      headEl.style.transform = `translateY(${lerp(20, 0, hT)}px)`;
    }

    toolsEl.querySelectorAll("[data-ticker-row]").forEach((row, i) => {
      const rT = easeOut(clamp01((p4 - 0.48 - i * 0.08) / 0.22));
      row.style.opacity = String(rT);
      row.style.transform = `translateY(${lerp(18, 0, rT)}px)`;
    });
  };

  useMotionValueEvent(phase1Progress, "change", onPhase1);
  useMotionValueEvent(phase2Progress, "change", onPhase2);
  useMotionValueEvent(phase3Progress, "change", onPhase3);
  useMotionValueEvent(phase4Progress, "change", onPhase4);

  return {
    containerRef,
    wrapRef,
    nameRef,
    descRef,
    blockRefs,
    imageWrapRef,
    videoWrapRef,
    videoRef,
    detailRef,
    techRef,
    mobileDrawerRef,
    toolsRef,
    progressBarHeight,
    nameScale,
    heroTextY,
    heroTextOpacity,
    heroTextScale,
    heroTextFilter,
    mobileTextY,
    heroImageOpacity,
    blocks,
    mobileBlocks
  };
}
