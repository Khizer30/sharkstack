import { motion, useMotionValue, useTransform } from "motion/react";
import { CheckIcon, SunburstIcon, OrbitRingsIcon, LatticeIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const ICONS = { sunburst: SunburstIcon, orbit: OrbitRingsIcon, lattice: LatticeIcon };

const THEMES = [
  { bg: colors.bgCardLight, text: colors.textPrimary },
  { bg: colors.secondary, text: colors.white },
  { bg: colors.gray100, text: colors.textPrimary }
];

export default function RevealCard({ card, index, scrollYProgress, isMobile, pinned = true }) {
  const fallbackProgress = useMotionValue(1);
  const start = 0.58 + index * 0.06;
  const end = start + 0.22;
  const y = useTransform(scrollYProgress ?? fallbackProgress, [start, end], ["100vh", "0vh"]);
  const theme = THEMES[index % THEMES.length];
  const Icon = ICONS[card.icon];

  const revealProps = pinned
    ? { style: { y } }
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      };

  return (
    <motion.div
      {...revealProps}
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        ...(revealProps.style ?? {}),
        flex: pinned && !isMobile ? 1 : "none",
        minWidth: pinned && isMobile ? "82vw" : undefined,
        width: !pinned ? "100%" : undefined,
        scrollSnapAlign: pinned && isMobile ? "center" : undefined,
        height: pinned ? "100%" : undefined,
        background: theme.bg,
        padding: "clamp(1.5rem, 2.4vw, 2.5rem)"
      }}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div style={{ color: theme.text }}>
            <Icon size={isMobile ? 64 : 88} />
          </div>
        )}
        <span style={{ ...fonts.mono, color: theme.text, fontSize: "0.85rem" }}>{String(index + 1).padStart(2, "0")}.</span>
      </div>

      <div>
        <h3 style={{ ...fonts.poppinsBold, color: theme.text, fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)", margin: 0 }}>{card.title}</h3>

        <div className="flex flex-col" style={{ gap: "0.75rem", marginTop: "clamp(1rem, 2vw, 1.5rem)" }}>
          {card.items.map((item) => (
            <div key={item} className="flex items-center" style={{ gap: "0.6rem" }}>
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "1.25rem", height: "1.25rem", background: colors.primary, color: colors.white }}
              >
                <CheckIcon size={11} />
              </span>
              <span style={{ ...fonts.montRegular, color: theme.text, fontSize: "0.9rem" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
