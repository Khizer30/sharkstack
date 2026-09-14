import { colors } from "@/constants/colors";

export const rgba = (hex, opacity) => {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((h) => parseInt(h, 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const makeStyles = () => `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }

  .bg-grid {
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, ${rgba(colors.primary, 0.05)} 1px, transparent 1px),
      linear-gradient(to bottom, ${rgba(colors.primary, 0.05)} 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }


  .hero-title-1 {
    color: ${colors.white};
    text-shadow: 0 10px 40px ${rgba(colors.primary, 0.25)}, 0 2px 6px rgba(0,0,0,0.4);
  }

  .hero-title-2 {
    background: linear-gradient(180deg, ${colors.white} 0%, ${rgba(colors.white, 0.3)} 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0 10px 30px ${rgba(colors.primary, 0.3)}) drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  }

  .card-title {
    background: linear-gradient(180deg, ${colors.white} 0%, ${colors.slate400} 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.7));
  }

  .deep-card {
    background: linear-gradient(145deg, ${colors.bgCardDeep} 0%, ${colors.bgBrand} 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,0.95),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px ${rgba(colors.primary, 0.15)},
      inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid ${rgba(colors.primary, 0.08)};
    position: relative;
  }

  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${rgba(colors.primary, 0.07)} 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .term-window {
    background: ${colors.bgDark};
    box-shadow:
      0 40px 80px -15px rgba(0,0,0,0.95),
      0 15px 25px -5px rgba(0,0,0,0.8),
      inset 0 1px 0 rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .term-chrome {
    background: linear-gradient(180deg, ${colors.termChrome} 0%, ${colors.termChromeEnd} 100%);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }

  .term-progress-track {
    background: ${rgba(colors.primary, 0.1)};
    border: 1px solid ${rgba(colors.primary, 0.12)};
  }

  .term-progress-fill {
    background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    box-shadow: 0 0 12px ${rgba(colors.primary, 0.5)};
    width: 0%;
  }

  .term-cursor {
    display: inline-block; width: 7px; height: 13px;
    background: ${colors.primary};
    animation: blink 1s step-end infinite;
    vertical-align: middle; margin-left: 3px; border-radius: 1px;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
`;
