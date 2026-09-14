import { motion } from "motion/react";

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: 0.5 + i * 0.045, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function AnimatedWords({ text, style }) {
  return (
    <p style={{ margin: 0, ...style }}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
