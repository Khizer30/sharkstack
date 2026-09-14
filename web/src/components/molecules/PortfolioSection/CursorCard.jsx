import { motion, AnimatePresence } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function CursorCard({ project, cursorX, cursorY }) {
  return (
    <motion.div style={{ x: cursorX, y: cursorY, zIndex: 10000 }} className="pointer-events-none fixed left-0 top-0 hidden md:block">
      <AnimatePresence mode="wait">
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative overflow-hidden rounded-xl"
            style={{
              width: "20rem",
              height: "13rem",
              border: `1px solid ${colors.white}12`,
              backgroundColor: colors.bgCardDeep,
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)"
            }}
          >
            <img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,9,20,0.85) 0%, transparent 60%)" }} />
            <div className="absolute bottom-0 w-full p-4">
              <div className="flex items-center gap-2">
                <div className="animate-pulse rounded-full" style={{ width: "6px", height: "6px", backgroundColor: colors.primary }} />
                <span
                  style={{
                    ...fonts.montSemiBold,
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: `${colors.white}70`
                  }}
                >
                  {project.category}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
