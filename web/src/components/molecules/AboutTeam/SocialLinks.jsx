import { motion, AnimatePresence } from "motion/react";
import { LinkedinIcon, InstagramIcon, DribbbleIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";

const ICONS = {
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  dribbble: DribbbleIcon
};

export default function SocialLinks({ socials, activeKey, isMobile = false }) {
  const entries = Object.entries(socials || {});

  const wrapperClass = isMobile
    ? "flex justify-end"
    : "sticky top-1/2 -translate-y-1/2 hidden md:flex justify-end";

  return (
    <div className={wrapperClass} style={{ height: "fit-content" }}>
      <AnimatePresence>
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, position: "absolute" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 rounded-xl"
          style={{ background: `${colors.white}0D`, border: `1px solid ${colors.white}14`, padding: "0.4rem" }}
        >
          {entries.map(([platform, href]) => {
            const Icon = ICONS[platform];
            if (!Icon) return null;
            return (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className="flex items-center justify-center rounded-lg transition-colors duration-200"
                style={{ width: "2.1rem", height: "2.1rem", color: `${colors.white}90` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.white}14`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={14} />
              </a>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
