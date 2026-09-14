import { motion, AnimatePresence } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function RoleLabel({ role }) {
  return (
    <div className="sticky top-1/2 -translate-y-1/2 hidden md:block" style={{ height: "fit-content" }}>
      <AnimatePresence>
        <motion.p
          key={role}
          data-role-label
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, position: "absolute" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            ...fonts.montMedium,
            color: `${colors.white}80`,
            fontSize: "1.2rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase"
          }}
        >
          {role}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
