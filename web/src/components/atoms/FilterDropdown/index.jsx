import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = value !== "All";

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center cursor-pointer"
        style={{
          ...fonts.montMedium,
          fontSize: "0.85rem",
          gap: "0.5rem",
          padding: "0.55rem 1.1rem 0.55rem 1.25rem",
          borderRadius: "9999px",
          border: `1px solid ${isActive ? colors.primary : colors.borderMedium}`,
          background: isActive ? `${colors.primary}0D` : colors.white,
          color: isActive ? colors.primary : colors.textSecondary,
          transition: "border-color 0.2s, color 0.2s, background-color 0.2s"
        }}
      >
        {isActive ? value : label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}>
          <ChevronDownIcon size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 0.5rem)",
              left: 0,
              minWidth: "11rem",
              background: colors.white,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: "0.85rem",
              boxShadow: `0 16px 40px ${colors.black}14`,
              padding: "0.4rem",
              zIndex: 20
            }}
          >
            {options.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between w-full cursor-pointer"
                  style={{
                    ...fonts.montMedium,
                    fontSize: "0.85rem",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.55rem",
                    border: "none",
                    background: selected ? `${colors.primary}0D` : "transparent",
                    color: selected ? colors.primary : colors.textSecondary,
                    textAlign: "left",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.backgroundColor = colors.bgSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {option === "All" ? label : option}
                  {selected && <CheckIcon size={14} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
