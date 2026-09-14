import { motion, useTransform } from "motion/react";

export default function Word({ word, index, total, progress }) {
  const start = 0.02 + (index / total) * 0.52;
  const end = Math.min(start + 0.1, 0.65);
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  return <motion.span style={{ opacity, display: "inline-block" }}>{word}</motion.span>;
}
