import { motion, useMotionValue, animate } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card3D from "@/components/atoms/Card3D";
import PixelOverlay from "@/components/atoms/PixelOverlay";
import { usePageTransition } from "@/context/PageTransition";
import { CARD_ASPECT, getCardIntroPos } from "@/hooks/usePortfolioScroll";

function modDist(i, v, n) {
  let d = (((i - v) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

const TRANSITION = { type: "spring", stiffness: 48, damping: 14, mass: 1.2 };

export default function PortfolioCard({ data, index, total, introPhase, isActive, activeProgress, itemStepMV, onHoverStart, onHoverEnd }) {
  const navigate = useNavigate();
  const { transitionTo } = usePageTransition();
  const { stackX, stackY, stackRot, zigzagX, zigzagY, zigzagRot } = getCardIntroPos(index, total);

  const xMV = useMotionValue(stackX);
  const yMV = useMotionValue(stackY);
  const rotMV = useMotionValue(stackRot);
  const scaleMV = useMotionValue(0.6);
  const opMV = useMotionValue(0);
  const zMV = useMotionValue(50);

  useEffect(() => {
    if (introPhase === "stack") {
      animate(opMV, 0.9, TRANSITION);
    } else if (introPhase === "zigzag") {
      animate(xMV, zigzagX, TRANSITION);
      animate(yMV, zigzagY, TRANSITION);
      animate(rotMV, zigzagRot, TRANSITION);
      animate(scaleMV, 0.48, TRANSITION);
    } else if (introPhase === "carousel-entry") {
      const dist = Math.abs(modDist(index, 0, total));
      const step = itemStepMV.get();
      animate(xMV, 0, TRANSITION);
      animate(yMV, modDist(index, 0, total) * step, TRANSITION);
      animate(rotMV, 0, TRANSITION);
      animate(scaleMV, Math.max(0.28, Math.pow(0.76, dist)), TRANSITION);
      animate(opMV, Math.max(0.07, 1 - dist * 0.28), TRANSITION);
    }
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "scroll") return;
    const update = () => {
      const v = activeProgress.get();
      const step = itemStepMV.get();
      const d = modDist(index, v % total, total);
      const dist = Math.abs(d);
      yMV.set(d * step);
      scaleMV.set(Math.max(0.28, Math.pow(0.76, dist)));
      opMV.set(Math.max(0.07, 1 - dist * 0.28));
      zMV.set(Math.round(100 - dist * 12));
    };
    update();
    const u1 = activeProgress.on("change", update);
    const u2 = itemStepMV.on("change", update);
    return () => {
      u1();
      u2();
    };
  }, [introPhase]);

  const canInteract = isActive && introPhase === "scroll";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(520px, 76vw)",
        aspectRatio: `520 / ${Math.round(520 * CARD_ASPECT)}`,
        pointerEvents: canInteract ? "auto" : "none",
        cursor: canInteract ? "pointer" : "default"
      }}
      onMouseEnter={() => canInteract && onHoverStart?.(data.bg)}
      onMouseLeave={() => onHoverEnd?.()}
      onClick={() => canInteract && transitionTo(`/portfolio/${data.id}`)}
    >
      <motion.div
        style={{
          x: xMV,
          y: yMV,
          rotate: rotMV,
          scale: scaleMV,
          opacity: opMV,
          zIndex: zMV,
          width: "100%",
          height: "100%"
        }}
      >
        <Card3D enabled={canInteract} innerStyle={{ borderRadius: "8px", overflow: "hidden", backgroundColor: data.bg }}>
          {({ isHovering }) => (
            <>
              {data.image && (
                <motion.img
                  src={data.image}
                  alt={data.name}
                  loading="lazy"
                  animate={{ scale: isHovering ? 1.18 : 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              <PixelOverlay active={isHovering} />
            </>
          )}
        </Card3D>
      </motion.div>
    </div>
  );
}
