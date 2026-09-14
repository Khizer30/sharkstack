import { motion } from "motion/react";
import { useId } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function PricingModeToggle({ options, value, onChange }) {
  const layoutId = useId();

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        gap: "0.25rem",
        padding: "0.3rem",
        borderRadius: "9999px",
        border: `1px solid ${colors.borderLight}`,
        background: colors.bgCard
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "0.65rem 1.4rem",
              borderRadius: "9999px",
              zIndex: 1
            }}
          >
            {active && (
              <motion.span
                layoutId={`pricing-mode-pill-${layoutId}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "9999px",
                  background: colors.textPrimary,
                  zIndex: -1
                }}
              />
            )}
            <span
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.85rem",
                color: active ? colors.white : colors.textSecondary,
                transition: "color 0.2s",
                whiteSpace: "nowrap"
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
