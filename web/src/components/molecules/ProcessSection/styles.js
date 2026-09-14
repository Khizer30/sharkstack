import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export const makeProcessStyles = (count) => `
  .ps-root {
    background: ${colors.bgBrand};
    color: ${colors.white};
    width: 100%;
  }

  /* ── Sticky cycling header ── */
  .ps-header {
    font-family: ${fonts.poppinsBold.fontFamily};
    font-weight: ${fonts.poppinsBold.fontWeight};
    font-size: clamp(2.2rem, 5.5vw, 5.5rem);
    line-height: 1.15;
    position: sticky;
    top: calc((${count} - 1) * -1lh);
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 40vh;
  }

  .ps-header-inner {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: calc(37.5vh - 0.575lh) 4vw 0;
  }

  .ps-label {
    position: sticky;
    top: calc(37.5vh - 0.575lh);
    margin: 0;
    padding-right: 0.35em;
    font-size: inherit;
    line-height: inherit;
    color: rgba(255,255,255,0.28);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ps-words {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ps-word {
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.28) 0 calc(50vh - 0.6lh),
      ${colors.primary}     calc(50vh - 0.6lh) calc(50vh + 0.6lh),
      rgba(255,255,255,0.28) calc(50vh + 0.6lh)
    );
    background-attachment: fixed;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* ── Slide-in panel ── */
  .ps-panel {
    width: 100%;
    height: 75vh;
    position: relative;
    z-index: 2;
  }

  .ps-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${colors.primary};
    border-radius: 1.25rem 1.25rem 0 0;
  }

  .ps-panel-inner {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 4vw;
    gap: 1.5rem;
    text-align: center;
  }

  .ps-panel-tag {
    font-family: ${fonts.montSemiBold.fontFamily};
    font-weight: ${fonts.montSemiBold.fontWeight};
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.4;
  }

  .ps-panel-heading { max-width: 18ch; }
  .ps-panel-body    { max-width: 52ch; opacity: 0.6; line-height: 1.7; }

  @supports (animation-timeline: view()) {
    .ps-panel { view-timeline: --ps-panel; }

    .ps-panel::before {
      transform-origin: 50% 100%;
      scale: 0.92;
      animation: psGrow both ease-in-out;
      animation-timeline: --ps-panel;
      animation-range: entry 50%;
    }

    .ps-panel-inner {
      animation: psReveal both ease-in-out;
      animation-timeline: --ps-panel;
      animation-range: entry 50%;
    }

    @keyframes psGrow   { to { scale: 1; border-radius: 0; } }
    @keyframes psReveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  }
`;
