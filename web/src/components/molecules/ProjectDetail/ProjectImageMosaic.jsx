import { colors } from "@/constants/colors";
import { COLS, ROWS, BW, BH, MOB_TOP, MOB_CH, MOB_CW } from "@/constants/projectDetail";

export default function ProjectImageMosaic({ project, blocks, mobileBlocks, blockRefs, imageWrapRef, isMobile }) {
  return (
    <div
      ref={imageWrapRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        overflow: "hidden",
        transformOrigin: "center center",
        willChange: "transform, opacity, border-radius",
        boxShadow: `0 32px 80px ${colors.black}60`
      }}
    >
      {blocks.map((b, i) => {
        const mb = mobileBlocks[i];
        return (
          <div
            key={i}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: isMobile ? `calc(1rem + ${b.col * MOB_CW}vw)` : `${b.col * BW}vw`,
              top: isMobile ? `calc(${MOB_TOP}vh + ${b.row * MOB_CH}vh)` : `${(b.row * 100) / ROWS}vh`,
              width: isMobile ? `${MOB_CW}vw` : `${BW}vw`,
              height: isMobile ? `${MOB_CH}vh` : BH,
              transform: isMobile
                ? `translate(${mb.scatterX}vw, ${mb.scatterY}vh) scale(${mb.scatterScale})`
                : `translate(${b.scatterX}vw, ${b.scatterY}vh) scale(${b.scatterScale})`,
              opacity: 0,
              overflow: "hidden",
              willChange: "transform, opacity",
              zIndex: 10
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${project.image})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${(b.col / (COLS - 1)) * 100}% ${(b.row / (ROWS - 1)) * 100}%`,
                backgroundRepeat: "no-repeat"
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
