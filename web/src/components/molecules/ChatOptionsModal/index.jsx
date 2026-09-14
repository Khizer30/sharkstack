import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarIcon, MailIcon, CloseIcon, ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";

function OptionButton({ icon, label, description, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        textAlign: "left",
        padding: "1.1rem 1.25rem",
        borderRadius: "1.1rem",
        border: `1px solid ${colors.borderLight}`,
        background: colors.bgCard,
        cursor: "pointer"
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "0.85rem",
          background: `${colors.primary}12`,
          color: colors.primary,
          flexShrink: 0
        }}
      >
        {icon}
      </span>

      <div style={{ flex: 1 }}>
        <span style={{ ...fonts.montBold, fontSize: "0.95rem", color: colors.textPrimary, display: "block" }}>{label}</span>
        <span style={{ ...textVariants.caption, color: colors.textMuted, marginTop: "0.15rem", display: "block" }}>{description}</span>
      </div>

      <span style={{ color: colors.textMuted, display: "flex", flexShrink: 0 }}>
        <ArrowRight size={16} />
      </span>
    </motion.button>
  );
}

export default function ChatOptionsModal({ open, packageName, onClose, onBookCall, onSendMessage }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: `${colors.black}70`,
              backdropFilter: "blur(6px)",
              zIndex: 9998
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              pointerEvents: "none"
            }}
          >
            <motion.div
              key="dialog"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                width: "min(26rem, 100%)",
                background: colors.white,
                borderRadius: "1.5rem",
                border: `1px solid ${colors.borderLight}`,
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.35)",
                padding: "clamp(1.75rem, 3vw, 2.25rem)",
                pointerEvents: "auto"
              }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  border: `1px solid ${colors.borderLight}`,
                  background: colors.white,
                  color: colors.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <CloseIcon size={13} />
              </button>

              <h3 style={{ ...textVariants.h4, paddingRight: "2rem" }}>
                {packageName ? `Let's talk about the ${packageName} package` : "Let's talk about it"}
              </h3>
              <p style={{ ...textVariants.bodySm, color: colors.textSecondary, marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                Choose how you'd like to connect — whichever's easiest.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <OptionButton icon={<CalendarIcon size={20} />} label="Book a call" description="Grab a slot on our calendar." onClick={onBookCall} />
                <OptionButton icon={<MailIcon size={20} />} label="Send a message" description="Tell us a bit about your project." onClick={onSendMessage} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
