import { motion, AnimatePresence } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import MagneticButton from "@/components/atoms/MagneticButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { sharkAiContent } from "@/content";

const LottieIcon = lazy(() => import("./LottieIcon"));

const SIZE = "clamp(3.6rem, 5vw, 4.1rem)";

export default function ChatOrbLauncher({ visible, hasUnread, onClick }) {
  const [showHint, setShowHint] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (sessionStorage.getItem("sharkai-hint-shown")) return;
    const showTimer = setTimeout(() => setShowHint(true), 2200);
    const hideTimer = setTimeout(() => {
      setShowHint(false);
      sessionStorage.setItem("sharkai-hint-shown", "1");
    }, 8200);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  const dismissHint = () => {
    setShowHint(false);
    sessionStorage.setItem("sharkai-hint-shown", "1");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.6 }}
      style={{ position: "relative" }}
    >
      <motion.div
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? (hovered ? 1.05 : 1) : 0.4,
          y: visible ? [0, -7, 0] : 0
        }}
        transition={
          visible
            ? { y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.25 }, scale: { type: "spring", stiffness: 320, damping: 16 } }
            : { duration: 0.2 }
        }
        style={{ position: "relative", pointerEvents: visible ? "auto" : "none" }}
      >
        {/* hint bubble */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              onClick={dismissHint}
              style={{
                position: "absolute",
                bottom: "calc(100% + 16px)",
                right: 0,
                maxWidth: "min(13rem, 60vw)",
                width: "max-content",
                background: colors.black,
                border: `1px solid ${colors.primary}40`,
                color: colors.white,
                ...fonts.mono,
                fontSize: "0.76rem",
                lineHeight: 1.4,
                padding: "0.6rem 0.85rem",
                borderRadius: "0.6rem",
                borderBottomRightRadius: "0.15rem",
                boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
                cursor: "pointer"
              }}
            >
              <span style={{ color: colors.primary }}>{">"}</span> {sharkAiContent.launcherHint}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position: "relative", width: SIZE, height: SIZE }}>
          {/* rotating gradient halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: hovered ? 2.6 : 7, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, ${colors.primary} 0deg, #7B2FBE 130deg, transparent 210deg, ${colors.primary} 360deg)`,
              opacity: hovered ? 1 : 0.75
            }}
          />
          {/* soft ambient bloom */}
          <div
            style={{
              position: "absolute",
              inset: "-40%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 65%)`,
              pointerEvents: "none"
            }}
          />

          <motion.div whileTap={{ scale: 0.86 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} style={{ position: "absolute", inset: 3 }}>
            <MagneticButton
              onClick={onClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              aria-label={`Chat with ${sharkAiContent.botName}`}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary
              }}
            >
              <div style={{ width: "78%", height: "78%", display: "flex" }}>
                <Suspense fallback={null}>
                  <LottieIcon />
                </Suspense>
              </div>

              {hasUnread && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }, delay: 0.4 }}
                  style={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: colors.termSuccess,
                    border: `2px solid ${colors.black}`
                  }}
                />
              )}
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
