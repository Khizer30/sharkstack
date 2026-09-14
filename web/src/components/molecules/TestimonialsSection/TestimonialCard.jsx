import { motion, useTransform, useSpring } from "motion/react";
import TestimonialAuthor from "@/components/atoms/TestimonialAuthor";
import { colors } from "@/constants/colors";
import { textVariants } from "@/constants/typography";

const STAGGER_PX = 90;
const STAIRS_END = 0.32;

const getCardStyle = (isMobile) => ({
  flexShrink: 0,
  width: "clamp(250px, 72vw, 440px)",
  alignSelf: isMobile ? "auto" : "stretch",
  ...(isMobile ? { minHeight: "clamp(320px, 60vh, 480px)" } : { maxHeight: "clamp(340px, 65vh, 560px)" }),
  marginRight: "clamp(1rem, 1.5vw, 1.5rem)",
  backgroundColor: colors.bgCardLight,
  borderRadius: "10px",
  padding: "clamp(1.25rem, 2.5vw, 2.25rem)",
  cursor: "pointer",
  position: "relative",
  userSelect: "none",
  display: "flex",
  flexDirection: "column",
  willChange: "transform"
});

const dividerStyle = {
  height: 1,
  backgroundColor: colors.borderLight,
  margin: "clamp(1.25rem, 2vw, 1.5rem) 0"
};

export default function TestimonialCard({
  data,
  index,
  scrollYProgress,
  isActive,
  isAnyActive,
  isHovered,
  isAnyHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
  isMobile = false
}) {
  const rawY = useTransform(scrollYProgress, [0, STAIRS_END], [index * STAGGER_PX, 0]);
  const y = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.4 });

  let opacity = 1;
  if (isAnyActive && !isActive) opacity = 0.07;
  else if (!isAnyActive && isAnyHovered && !isHovered) opacity = 0.2;

  let scale = 1;
  if (isActive) scale = 1.04;
  else if (isHovered && !isAnyActive) scale = 1.09;

  return (
    <motion.div
      initial={false}
      animate={{ opacity, scale, zIndex: isActive ? 50 : 1 }}
      transition={{
        opacity: { duration: 0.28, ease: "easeOut" },
        scale: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }
      }}
      style={{ ...getCardStyle(isMobile), y }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "4.5rem",
            lineHeight: "1",
            color: colors.primary,
            userSelect: "none"
          }}
        >
          &rdquo;
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: isMobile ? "flex-start" : "center" }}>
        <p
          style={{
            ...textVariants.bodySm,
            color: colors.textSecondary,
            fontSize: "1rem",
            lineHeight: 1.8,
            margin: 0,
            overflowWrap: "break-word",
            wordBreak: "break-word"
          }}
        >
          {data.text}
        </p>
      </div>

      <div style={dividerStyle} />

      <TestimonialAuthor avatar={data.avatar} name={data.name} company={data.company || data.role} />
    </motion.div>
  );
}
