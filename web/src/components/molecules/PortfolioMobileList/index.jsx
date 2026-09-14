import { motion } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { usePortfolios } from "@/hooks/usePortfolios";

export default function PortfolioMobileList() {
  const { projects } = usePortfolios();

  return (
    <div
      style={{
        backgroundColor: colors.bgDark,
        minHeight: "100vh",
        paddingTop: "7rem",
        paddingBottom: "5rem"
      }}
    >
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.055, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1.4rem 1.5rem",
            borderBottom: `1px solid ${colors.white}0e`
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                color: colors.primary,
                margin: "0 0 0.3rem"
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2
              style={{
                ...fonts.poppinsBold,
                fontSize: "clamp(1.25rem, 5.5vw, 1.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: colors.white,
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {project.name}
            </h2>
            <p
              style={{
                ...fonts.montMedium,
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: `${colors.white}38`,
                margin: "0.3rem 0 0"
              }}
            >
              {project.category}
            </p>
          </div>

          <div
            style={{
              width: "82px",
              height: "82px",
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: project.bg
            }}
          >
            {project.image && (
              <img src={project.image} alt={project.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
