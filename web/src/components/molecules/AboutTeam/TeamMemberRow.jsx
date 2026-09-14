import { motion, AnimatePresence } from "motion/react";
import { LinkedinIcon, InstagramIcon, DribbbleIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const PHOTO_SIZE = {
  mobile: { width: 152, height: 190 },
  desktop: { width: 240, height: 300 }
};

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 220, damping: 24, mass: 0.9 };
const COLOR_TRANSITION = { duration: 0.5, ease: EASE };

export default function TeamMemberRow({ member, index, isActive, isMobile, rowRef }) {
  const size = isMobile ? PHOTO_SIZE.mobile : PHOTO_SIZE.desktop;

  return (
    <div
      ref={rowRef}
      data-index={index}
      className="relative flex flex-col items-center justify-center text-center"
      style={{ padding: isMobile ? "1.25rem 0" : "2rem 0" }}
    >
      <motion.div
        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ scale: SPRING, opacity: { duration: 0.45, ease: EASE } }}
        style={{ height: size.height, marginBottom: 16, transformOrigin: "center" }}
        className="flex items-center justify-center overflow-hidden"
      >
        <img
          src={member.image}
          alt={member.name}
          style={{
            width: size.width,
            height: size.height,
            boxShadow: `0 25px 50px -12px ${colors.black}90`,
            border: `1px solid ${colors.white}14`
          }}
          className="object-cover rounded-2xl"
        />
      </motion.div>

      <motion.h3
        animate={{
          color: isActive ? colors.white : `${colors.white}24`,
          scale: isActive ? 1 : 0.56
        }}
        transition={{ color: COLOR_TRANSITION, scale: SPRING }}
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(2rem, 5vw, 4rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em"
        }}
      >
        {member.name}
      </motion.h3>

      {isMobile && (
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col items-center gap-3 mt-[0.6rem]"
            >
              <p
                style={{
                  ...fonts.montMedium,
                  color: `${colors.white}80`,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
              >
                {member.role}
              </p>

              {/* Mobile Social Links */}
              {member.socials && Object.keys(member.socials).length > 0 && (
                <div
                  className="flex items-center gap-1.5 rounded-xl"
                  style={{ background: `${colors.white}0D`, border: `1px solid ${colors.white}14`, padding: "0.4rem" }}
                >
                  {Object.entries(member.socials).map(([platform, href]) => {
                    const Icon = {
                      linkedin: LinkedinIcon,
                      instagram: InstagramIcon,
                      dribbble: DribbbleIcon
                    }[platform];
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
                      >
                        <Icon size={14} />
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
