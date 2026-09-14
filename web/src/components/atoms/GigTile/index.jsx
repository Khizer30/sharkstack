import { motion } from "motion/react";
import { useState } from "react";
import { LaptopIcon, LatticeIcon, OrbitRingsIcon, SparkleIcon, CheckIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";

const ICONS = {
  laptop: LaptopIcon,
  lattice: LatticeIcon,
  orbit: OrbitRingsIcon,
  sparkle: SparkleIcon
};

export default function GigTile({ name, tagline, icon, active, onClick }) {
  const Icon = ICONS[icon] ?? SparkleIcon;
  const [hovered, setHovered] = useState(false);
  const isOn = active || hovered;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        background: isOn ? `radial-gradient(120% 140% at 0% 0%, ${colors.primary}26 0%, ${colors.textPrimary} 45%)` : colors.bgCard,
        borderColor: isOn ? colors.primary : colors.borderMedium,
        boxShadow: isOn
          ? `0 30px 60px -20px ${colors.primary}40, 0 25px 50px rgba(0,0,0,0.25), 0 0 0 3px ${colors.primary}40`
          : "0 8px 24px rgba(15, 23, 42, 0.06)"
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        gap: "1rem",
        textAlign: "left",
        padding: "2rem",
        minHeight: "15rem",
        borderRadius: "1.5rem",
        borderWidth: "1.5px",
        borderStyle: "solid",
        cursor: "pointer",
        width: "100%"
      }}
    >
      {active && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: "absolute",
            top: "-0.65rem",
            right: "1.25rem",
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "50%",
            background: colors.primary,
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 20px ${colors.primary}60`
          }}
        >
          <CheckIcon size={13} />
        </motion.span>
      )}

      <motion.span
        animate={{
          backgroundColor: isOn ? `${colors.white}22` : `${colors.primary}12`,
          color: isOn ? colors.white : colors.primary
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "3.25rem",
          height: "3.25rem",
          borderRadius: "0.9rem",
          flexShrink: 0
        }}
      >
        <Icon size={24} />
      </motion.span>

      <div>
        <span style={{ ...fonts.montBold, fontSize: "1.15rem", color: isOn ? colors.white : colors.textPrimary, display: "block", transition: "color 0.25s" }}>
          {name}
        </span>
        <span
          style={{
            ...textVariants.bodySm,
            color: isOn ? `${colors.white}90` : colors.textSecondary,
            marginTop: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "color 0.25s"
          }}
        >
          {tagline}
        </span>
      </div>
    </motion.button>
  );
}
