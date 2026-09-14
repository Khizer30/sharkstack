import { motion } from "motion/react";
import { CheckIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function FeatureCheckItem({ label, price, checked, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      whileHover={{ y: -1, borderColor: colors.primary, backgroundColor: checked ? `${colors.primary}12` : `${colors.primary}06` }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        width: "100%",
        border: `1px solid ${checked ? colors.primary : colors.borderLight}`,
        background: checked ? `${colors.primary}0A` : colors.white,
        borderRadius: "0.85rem",
        padding: "0.85rem 1rem",
        cursor: "pointer",
        textAlign: "left"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.15rem",
            height: "1.15rem",
            borderRadius: "0.4rem",
            border: `1.5px solid ${checked ? colors.primary : colors.borderMedium}`,
            background: checked ? colors.primary : "transparent",
            flexShrink: 0,
            transition: "background-color 0.2s, border-color 0.2s"
          }}
        >
          <motion.span
            initial={false}
            animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", color: colors.white }}
          >
            <CheckIcon size={11} />
          </motion.span>
        </span>
        <span style={{ ...fonts.montMedium, fontSize: "0.9rem", color: colors.textPrimary }}>{label}</span>
      </div>

      <span style={{ ...fonts.montSemiBold, fontSize: "0.8rem", color: checked ? colors.primary : colors.textMuted, whiteSpace: "nowrap" }}>
        +${price.toLocaleString("en-US")}
      </span>
    </motion.button>
  );
}
