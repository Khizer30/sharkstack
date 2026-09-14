import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function QuickReplies({ items, onSelect }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0 0.1rem" }}
    >
      {items.map((item) => (
        <motion.button
          key={item.label}
          type="button"
          onClick={() => onSelect(item)}
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 20 } }
          }}
          whileHover={{ backgroundColor: colors.white, color: colors.black, scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          style={{
            ...fonts.mono,
            fontSize: "0.76rem",
            color: `${colors.white}B0`,
            backgroundColor: `${colors.white}00`,
            border: `1px solid ${colors.white}25`,
            borderRadius: "0.45rem",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          <span style={{ color: colors.primary }}>{">"}</span> {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
