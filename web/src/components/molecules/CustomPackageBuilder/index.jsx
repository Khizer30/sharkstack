import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { CheckIcon, ChatBubbleIcon } from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import CountUp from "@/components/atoms/CountUp";
import FeatureCheckItem from "@/components/atoms/FeatureCheckItem";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { supportEmail } from "@/content";

export default function CustomPackageBuilder({ gigName, basePrice, categories, ctaLabel, disclaimer, onChatAboutIt }) {
  const [selected, setSelected] = useState(() => new Set());

  const allFeatures = useMemo(() => categories.flatMap((c) => c.features), [categories]);

  const toggleFeature = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedFeatures = useMemo(() => allFeatures.filter((f) => selected.has(f.id)), [allFeatures, selected]);

  const total = basePrice + selectedFeatures.reduce((sum, f) => sum + f.price, 0);

  const handleRequestQuote = () => {
    const lines = [
      `Base package: $${basePrice.toLocaleString("en-US")}`,
      ...selectedFeatures.map((f) => `+ ${f.label}: $${f.price.toLocaleString("en-US")}`),
      "",
      `Estimated total: $${total.toLocaleString("en-US")}`
    ];
    const subject = encodeURIComponent(`${gigName} custom package inquiry`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] items-start" style={{ gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 3vw, 2rem)" }}>
        {categories.map((category, ci) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: ci * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: "clamp(1.5rem, 2.5vw, 2rem)",
              borderRadius: "1.5rem",
              border: `1.5px solid ${colors.borderMedium}`,
              background: colors.bgCard,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)"
            }}
          >
            <span
              style={{
                ...fonts.montBold,
                fontSize: "0.65rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: colors.primary
              }}
            >
              {category.name}
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "1rem" }}>
              {category.features.map((feature) => (
                <FeatureCheckItem
                  key={feature.id}
                  label={feature.label}
                  price={feature.price}
                  checked={selected.has(feature.id)}
                  onToggle={() => toggleFeature(feature.id)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="lg:sticky"
        style={{
          top: "clamp(6rem, 10vw, 8rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "clamp(1.75rem, 3vw, 2.5rem)",
          borderRadius: "1.5rem",
          border: `1px solid ${colors.primary}30`,
          background: `radial-gradient(120% 140% at 100% 0%, ${colors.primary}20 0%, ${colors.textPrimary} 45%)`,
          boxShadow: `0 30px 60px -20px ${colors.primary}35, 0 25px 50px rgba(0,0,0,0.25)`
        }}
      >
        <div>
          <span style={{ ...textVariants.caption, color: `${colors.white}60` }}>Estimated total</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.35rem" }}>
            <span style={{ ...fonts.poppinsBold, fontSize: "2.4rem", letterSpacing: "-0.02em", color: colors.white }}>
              <CountUp value={total} prefix="$" duration={0.6} />
            </span>
            <span style={{ ...textVariants.caption, color: `${colors.white}60` }}>estimate</span>
          </div>
        </div>

        <div style={{ height: "1px", background: `${colors.white}18` }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ ...textVariants.bodySm, color: `${colors.white}90` }}>Base package</span>
            <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem", color: colors.white }}>${basePrice.toLocaleString("en-US")}</span>
          </div>

          {selectedFeatures.length === 0 ? (
            <p style={{ ...textVariants.bodySm, color: `${colors.white}50`, marginTop: "0.25rem" }}>Select features on the left to build your quote.</p>
          ) : (
            selectedFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span style={{ color: colors.primary, flexShrink: 0, display: "flex" }}>
                  <CheckIcon size={12} />
                </span>
                <span style={{ ...textVariants.bodySm, color: `${colors.white}90`, flex: 1 }}>{feature.label}</span>
                <span style={{ ...fonts.montSemiBold, fontSize: "0.8rem", color: colors.white }}>+${feature.price.toLocaleString("en-US")}</span>
              </motion.div>
            ))
          )}
        </div>

        <Button onClick={handleRequestQuote} style={{ width: "100%", justifyContent: "center", backgroundColor: colors.primary }}>
          {ctaLabel}
        </Button>

        <motion.button
          type="button"
          onClick={() => onChatAboutIt?.(`${gigName} custom`)}
          whileHover={{ y: -2, scale: 1.01, borderColor: `${colors.white}60`, backgroundColor: `${colors.white}0D` }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "9999px",
            border: `1px solid ${colors.white}30`,
            background: "transparent",
            color: colors.white,
            cursor: "pointer",
            ...fonts.montSemiBold,
            fontSize: "0.8rem"
          }}
        >
          <ChatBubbleIcon size={14} />
          Chat about it
        </motion.button>

        <p style={{ ...textVariants.caption, color: `${colors.white}45`, textAlign: "center" }}>{disclaimer}</p>
      </motion.div>
    </div>
  );
}
