import { motion } from "motion/react";
import { CheckIcon, SparkleIcon } from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { supportEmail } from "@/content";

function Cell({ value, selected }) {
  if (typeof value === "boolean") {
    return (
      <span style={{ display: "flex", justifyContent: "center" }}>
        {value ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.4rem",
              height: "1.4rem",
              borderRadius: "50%",
              background: selected ? `${colors.primary}25` : `${colors.primary}12`,
              color: colors.primary
            }}
          >
            <CheckIcon size={12} />
          </span>
        ) : (
          <span style={{ color: colors.textDisabled }}>—</span>
        )}
      </span>
    );
  }
  return <span style={{ ...textVariants.bodySm, color: colors.textSecondary, textAlign: "center", display: "block" }}>{value}</span>;
}

function requestPackage(name) {
  window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(`${name} package inquiry`)}`;
}

export default function PackageComparisonTable({ packages, compareRows, selectedPackage, onSelectPackage }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "640px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(3, 1fr)",
            borderRadius: "1.25rem",
            border: `1px solid ${colors.borderLight}`,
            overflow: "hidden",
            background: colors.bgCard
          }}
        >
          {/* header row */}
          <div style={{ padding: "1.5rem 1.25rem" }} />
          {packages.map((pkg, i) => {
            const isSelected = pkg.name === selectedPackage;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectPackage?.(pkg.name)}
                style={{
                  position: "relative",
                  padding: "1.5rem 1.25rem",
                  textAlign: "center",
                  cursor: onSelectPackage ? "pointer" : "default",
                  background: isSelected ? colors.textPrimary : "transparent",
                  transition: "background-color 0.25s ease"
                }}
              >
                {pkg.highlight && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      ...fonts.montBold,
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: colors.white,
                      background: colors.primary,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "9999px"
                    }}
                  >
                    <SparkleIcon size={9} />
                    Popular
                  </span>
                )}
                <span
                  style={{
                    ...fonts.montBold,
                    fontSize: "0.95rem",
                    color: isSelected ? colors.white : colors.textPrimary,
                    display: "block",
                    marginTop: pkg.highlight ? "1.1rem" : 0
                  }}
                >
                  {pkg.name}
                </span>
                <span
                  style={{
                    ...fonts.poppinsBold,
                    fontSize: "1.3rem",
                    letterSpacing: "-0.02em",
                    color: isSelected ? colors.white : colors.textPrimary,
                    display: "block",
                    marginTop: "0.35rem"
                  }}
                >
                  {pkg.price}
                </span>

                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage?.(pkg.name);
                    requestPackage(pkg.name);
                  }}
                  style={{
                    justifyContent: "center",
                    margin: "0.85rem auto 0",
                    backgroundColor: isSelected ? colors.primary : colors.textPrimary
                  }}
                >
                  Select
                </Button>
              </motion.div>
            );
          })}

          {/* body rows */}
          {compareRows.map((row, ri) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: ri * 0.04 }}
              style={{ display: "contents" }}
            >
              <div
                style={{
                  padding: "0.9rem 1.25rem",
                  background: ri % 2 === 0 ? colors.bgSecondary : "transparent",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span style={{ ...fonts.montMedium, fontSize: "0.85rem", color: colors.textPrimary }}>{row.label}</span>
              </div>
              {row.values.map((value, ci) => {
                const colSelected = packages[ci].name === selectedPackage;
                return (
                  <div
                    key={ci}
                    style={{
                      padding: "0.9rem 1rem",
                      background:
                        ri % 2 === 0 ? (colSelected ? `${colors.primary}08` : colors.bgSecondary) : colSelected ? `${colors.primary}05` : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.25s ease"
                    }}
                  >
                    <Cell value={value} selected={colSelected} />
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
