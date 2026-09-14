import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";
import { portfolioIntroContent } from "@/content";

export default function ViewAllWorksLink() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(4rem, 8vw, 8rem)",
        backgroundColor: colors.bgBrand,
        position: "relative",
        zIndex: 3
      }}
    >
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Link
          to="/portfolio"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            ...fonts.montSemiBold,
            fontSize: sizes.sm,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: colors.white,
            textDecoration: "none",
            border: `1px solid ${colors.white}22`,
            padding: "0.85rem 2rem",
            borderRadius: "999px",
            transition: "border-color 0.25s, color 0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${colors.primary}88`;
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${colors.white}22`;
            e.currentTarget.style.color = colors.white;
          }}
        >
          {portfolioIntroContent.viewAllLabel}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6.5H11M11 6.5L7 2.5M11 6.5L7 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
