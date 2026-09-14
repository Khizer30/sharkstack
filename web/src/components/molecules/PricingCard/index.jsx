import { motion } from "motion/react";
import { CheckIcon, SparkleIcon, ChatBubbleIcon } from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { supportEmail } from "@/content";

export default function PricingCard({
  name,
  tagline,
  price,
  period,
  delivery,
  revisions,
  features,
  highlight,
  index = 0,
  selected,
  onSelect,
  onGetStarted,
  onChatAboutIt
}) {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(name);
    } else {
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(`${name} package inquiry`)}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect?.(name)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        borderRadius: "1.5rem",
        cursor: onSelect ? "pointer" : "default",
        border: `1.5px solid ${selected ? colors.primary : colors.borderMedium}`,
        background: selected ? `radial-gradient(120% 140% at 0% 0%, ${colors.primary}26 0%, ${colors.textPrimary} 45%)` : colors.bgCard,
        boxShadow: selected
          ? `0 30px 60px -20px ${colors.primary}40, 0 25px 50px rgba(0,0,0,0.25), 0 0 0 3px ${colors.primary}40`
          : "0 8px 24px rgba(15, 23, 42, 0.06)",
        transition: "box-shadow 0.35s ease, border-color 0.25s ease"
      }}
    >
      {selected && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: "absolute",
            top: "-0.65rem",
            right: "1.25rem",
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "50%",
            background: colors.primary,
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 20px ${colors.primary}60`
          }}
        >
          <CheckIcon size={13} />
        </motion.span>
      )}

      {highlight && (
        <motion.span
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            top: "-0.8rem",
            left: "clamp(1.75rem, 3vw, 2.5rem)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            ...fonts.montBold,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: colors.white,
            background: colors.primary,
            padding: "0.35rem 0.85rem",
            borderRadius: "9999px",
            boxShadow: `0 8px 20px ${colors.primary}55`
          }}
        >
          <SparkleIcon size={11} />
          Most popular
        </motion.span>
      )}

      <div>
        <h3 style={{ ...textVariants.h3, color: selected ? colors.white : colors.textPrimary }}>{name}</h3>
        <p style={{ ...textVariants.bodySm, color: selected ? `${colors.white}90` : colors.textSecondary, marginTop: "0.4rem" }}>{tagline}</p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ ...fonts.poppinsBold, fontSize: "2.1rem", letterSpacing: "-0.02em", color: selected ? colors.white : colors.textPrimary }}>{price}</span>
        <span style={{ ...textVariants.caption, color: selected ? `${colors.white}60` : colors.textMuted }}>{period}</span>
      </div>

      {(delivery || revisions) && (
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {delivery && (
            <div>
              <span style={{ ...textVariants.caption, color: selected ? `${colors.white}55` : colors.textMuted, display: "block" }}>Delivery</span>
              <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem", color: selected ? colors.white : colors.textPrimary }}>{delivery}</span>
            </div>
          )}
          {revisions && (
            <div>
              <span style={{ ...textVariants.caption, color: selected ? `${colors.white}55` : colors.textMuted, display: "block" }}>Revisions</span>
              <span style={{ ...fonts.montSemiBold, fontSize: "0.85rem", color: selected ? colors.white : colors.textPrimary }}>{revisions}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ height: "1px", background: selected ? `${colors.white}18` : colors.borderLight }} />

      <ul style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1, margin: 0, padding: 0, listStyle: "none" }}>
        {features.map((feature, i) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.1 + i * 0.05 + 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.05rem",
                height: "1.05rem",
                borderRadius: "50%",
                marginTop: "0.1rem",
                flexShrink: 0,
                background: selected ? `${colors.primary}30` : `${colors.primary}12`,
                color: colors.primary
              }}
            >
              <CheckIcon size={11} />
            </span>
            <span style={{ ...textVariants.bodySm, color: selected ? `${colors.white}90` : colors.textSecondary }}>{feature}</span>
          </motion.li>
        ))}
      </ul>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleGetStarted();
          }}
          style={{
            width: "100%",
            justifyContent: "center",
            backgroundColor: selected ? colors.primary : colors.textPrimary
          }}
        >
          Get started
        </Button>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChatAboutIt?.(name);
          }}
          whileHover={{
            y: -2,
            scale: 1.01,
            borderColor: selected ? `${colors.white}60` : colors.primary,
            backgroundColor: selected ? `${colors.white}0D` : `${colors.primary}08`
          }}
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
            border: `1px solid ${selected ? `${colors.white}30` : colors.borderMedium}`,
            background: "transparent",
            color: selected ? colors.white : colors.textSecondary,
            cursor: "pointer",
            ...fonts.montSemiBold,
            fontSize: "0.8rem"
          }}
        >
          <ChatBubbleIcon size={14} />
          Chat about it
        </motion.button>
      </div>
    </motion.div>
  );
}
