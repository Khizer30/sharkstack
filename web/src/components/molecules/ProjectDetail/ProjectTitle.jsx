import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ProjectTitle({ project, isMobile, wrapRef, nameRef, nameScale }) {
  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        top: isMobile ? "3.8rem" : "clamp(1.5rem, 2.5vw, 2rem)",
        left: "clamp(1.5rem, 2.5vw, 2.5rem)",
        right: "clamp(1.5rem, 2.5vw, 2.5rem)",
        zIndex: 20,
        overflow: "hidden"
      }}
    >
      <motion.h1
        ref={nameRef}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 55, damping: 16, mass: 1.2, delay: 0.1 }}
        style={{
          scale: nameScale,
          transformOrigin: "top left",
          ...fonts.poppinsBold,
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          margin: 0,
          color: colors.black
        }}
      >
        {project.name?.toUpperCase() ?? ""}
      </motion.h1>
    </div>
  );
}
