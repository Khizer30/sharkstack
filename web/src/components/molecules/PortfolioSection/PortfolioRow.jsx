import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, PlusIcon, MinusIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { usePageTransition } from "@/context/PageTransition";

export default function PortfolioRow({ data, index, isActive, setActiveId, isMobile, isAnyActive }) {
  const { transitionTo } = usePageTransition();
  const isDimmed = isAnyActive && !isActive;
  const isSkeleton = Boolean(data.isSkeleton);
  const isFailed = isSkeleton && Boolean(data.isFailed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isSkeleton ? (isFailed ? 0.35 : 0) : isDimmed ? 0.2 : 1,
        y: 0,
        backgroundColor: isActive && isMobile ? "rgba(255,255,255,0.03)" : "transparent"
      }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onMouseEnter={() => !isSkeleton && !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isSkeleton && !isMobile && setActiveId(null)}
      onClick={() => !isSkeleton && (isMobile ? setActiveId(isActive ? null : data.id) : transitionTo(`/portfolio/${data.id}`))}
      style={{
        borderBottom: `1px solid ${colors.white}12`,
        cursor: isSkeleton ? "default" : "pointer",
        pointerEvents: isSkeleton ? "none" : "auto"
      }}
      className="group relative"
    >
      <div
        className="relative z-10 flex items-center justify-between"
        style={{
          paddingTop: "clamp(1.75rem, 3.5vw, 3.5rem)",
          paddingBottom: "clamp(1.75rem, 3.5vw, 3.5rem)"
        }}
      >
        <div
          className="flex items-center gap-5 md:gap-8 transition-transform duration-500 group-hover:translate-x-3"
          style={{ minWidth: 0, overflow: "hidden" }}
        >
          <span
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: colors.primary,
              minWidth: "1.5rem"
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {isSkeleton ? (
            <div style={{ width: "clamp(8rem, 24vw, 16rem)", height: "clamp(1.5rem, 4vw, 4rem)", borderRadius: "0.5rem", background: `${colors.white}20` }} />
          ) : (
            <h2
              className="transition-colors duration-300"
              style={{
                ...fonts.poppinsBold,
                fontSize: "clamp(1.5rem, 4vw, 4rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: isActive ? colors.white : `${colors.white}45`,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {data.name}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          {isSkeleton ? (
            <div
              className="hidden md:block"
              style={{ width: "5rem", height: "0.75rem", borderRadius: "0.25rem", background: `${colors.white}14`, marginRight: "0.5rem" }}
            />
          ) : (
            <div className="hidden md:flex flex-col items-end gap-1" style={{ marginRight: "0.5rem" }}>
              <span
                className="transition-colors duration-300"
                style={{
                  ...fonts.montSemiBold,
                  fontSize: "0.75rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: isActive ? `${colors.white}70` : `${colors.white}30`
                }}
              >
                {data.category}
              </span>
              <span
                style={{
                  ...fonts.montRegular,
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: `${colors.white}20`
                }}
              >
                {data.year}
              </span>
            </div>
          )}

          <div className="block md:hidden" style={{ color: `${colors.white}35` }}>
            {isActive ? <MinusIcon /> : <PlusIcon />}
          </div>

          <motion.div
            animate={{ x: isActive ? 0 : -8, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block"
            style={{ color: colors.primary }}
          >
            <ArrowUpRight />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div style={{ padding: "0.75rem 0 1.25rem" }}>
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "16/9" }}
                onClick={(e) => {
                  e.stopPropagation();
                  transitionTo(`/portfolio/${data.id}`);
                }}
              >
                <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-4 left-4">
                  <p
                    style={{
                      ...fonts.montSemiBold,
                      fontSize: "0.6rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: colors.white
                    }}
                  >
                    View Project
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
