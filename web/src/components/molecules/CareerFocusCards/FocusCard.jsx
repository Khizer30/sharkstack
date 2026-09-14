import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, LaptopIcon, SparkleIcon, ChartIcon, BookIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { scrollToId } from "@/utils/helpers";

const ICONS = { laptop: LaptopIcon, sparkle: SparkleIcon, chart: ChartIcon, book: BookIcon };

export default function FocusCard({ card, active, onHover, isMobile }) {
  const Icon = ICONS[card.icon];
  const handleClick = () => {
    if (isMobile && !active) {
      onHover();
      return;
    }
    scrollToId(card.target);
  };

  return (
    <motion.div
      onMouseEnter={!isMobile ? onHover : undefined}
      onClick={handleClick}
      animate={isMobile ? { height: active ? "clamp(16rem, 60vw, 20rem)" : "4rem" } : { flexGrow: active ? 2.4 : 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-pointer overflow-hidden"
      style={{
        flexBasis: isMobile ? "auto" : 0,
        width: isMobile ? "100%" : undefined,
        minWidth: isMobile ? "100%" : active ? "16rem" : "8rem",
        height: isMobile ? undefined : "clamp(20rem, 34vw, 26rem)",
        background: active ? colors.cream : `${colors.white}26`,
        backdropFilter: active ? "none" : "blur(14px)",
        border: `1px solid ${colors.white}33`,
        display: "flex",
        alignItems: active ? "stretch" : isMobile ? "center" : "flex-end",
        justifyContent: isMobile && !active ? "flex-start" : "center",
        padding: active ? "clamp(1.5rem, 3vw, 2.5rem)" : isMobile ? "0 1.5rem" : "1.5rem",
        transition: "background 0.55s ease, backdrop-filter 0.55s ease"
      }}
    >
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 style={{ ...fonts.poppinsBold, color: colors.textPrimary, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", margin: 0 }}>{card.title}</h3>
                {Icon && (
                  <div style={{ color: colors.primary }}>
                    <Icon size={28} />
                  </div>
                )}
              </div>
              <p style={{ ...fonts.montRegular, color: colors.textSecondary, fontSize: "0.95rem", lineHeight: 1.6, marginTop: "0.85rem" }}>{card.desc}</p>
            </div>

            <div>
              <div style={{ height: "1px", background: colors.borderMedium, marginBottom: "1rem" }} />
              <motion.div
                className="flex items-center cursor-pointer"
                style={{ ...fonts.montMedium, fontSize: "0.95rem", gap: "0.6rem" }}
                initial="rest"
                animate="rest"
                whileHover="hover"
              >
                <motion.span variants={{ rest: { color: colors.textPrimary }, hover: { color: colors.primary } }}>{card.ctaLabel}</motion.span>
                <motion.span
                  className="flex items-center"
                  variants={{ rest: { x: 0, color: colors.textPrimary }, hover: { x: 4, color: colors.primary } }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.span
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ ...fonts.poppinsMedium, color: colors.white, fontSize: "1.1rem", whiteSpace: "nowrap" }}
          >
            {card.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
