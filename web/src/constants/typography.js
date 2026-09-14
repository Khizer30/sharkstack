import { colors } from "./colors";

export const fonts = {
  montRegular: { fontFamily: "'Montserrat', sans-serif", fontWeight: "400" },
  montMedium: { fontFamily: "'Montserrat', sans-serif", fontWeight: "500" },
  montSemiBold: { fontFamily: "'Montserrat', sans-serif", fontWeight: "600" },
  montBold: { fontFamily: "'Montserrat', sans-serif", fontWeight: "700" },

  poppinsMedium: { fontFamily: "'Poppins', sans-serif", fontWeight: "500" },
  poppinsSemiBold: { fontFamily: "'Poppins', sans-serif", fontWeight: "600" },
  poppinsBold: { fontFamily: "'Poppins', sans-serif", fontWeight: "700" },

  mono: { fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace", fontWeight: "400" },
  monoBold: { fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace", fontWeight: "700" }
};

export const sizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  md: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  xxl: "1.5rem", // 24px
  xxxl: "2rem", // 32px
  huge: "2.5rem" // 40px
};

// Usage: <Text variant="h1">Hello</Text>
export const textVariants = {
  h1: { ...fonts.poppinsBold, fontSize: sizes.huge, color: colors.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.2 },
  h2: { ...fonts.poppinsBold, fontSize: sizes.xxxl, color: colors.textPrimary, letterSpacing: "-0.02em", lineHeight: 1.25 },
  h3: { ...fonts.poppinsSemiBold, fontSize: sizes.xxl, color: colors.textPrimary, lineHeight: 1.3 },
  h4: { ...fonts.poppinsSemiBold, fontSize: sizes.xl, color: colors.textPrimary, lineHeight: 1.35 },

  subtitle: { ...fonts.poppinsMedium, fontSize: sizes.md, color: colors.textSecondary, lineHeight: 1.5 },

  body: { ...fonts.montRegular, fontSize: sizes.md, color: colors.textPrimary, lineHeight: 1.6 },
  bodySm: { ...fonts.montRegular, fontSize: sizes.sm, color: colors.textPrimary, lineHeight: 1.6 },

  label: { ...fonts.montSemiBold, fontSize: sizes.sm, color: colors.textPrimary, lineHeight: 1.4 },
  caption: { ...fonts.montRegular, fontSize: sizes.xs, color: colors.textMuted, lineHeight: 1.5 },

  button: { ...fonts.poppinsSemiBold, fontSize: sizes.md, color: colors.white, lineHeight: 1 },
  link: { ...fonts.montMedium, fontSize: sizes.md, color: colors.primary, lineHeight: 1.5 }
};
