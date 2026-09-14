import { colors } from "@/constants/colors";
import { fonts, sizes, textVariants } from "@/constants/typography";

export default function TestimonialAuthor({ avatar, name, company }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <img src={avatar} alt={name} width={60} height={60} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, display: "block" }} />
      <div>
        <p style={{ ...fonts.poppinsSemiBold, fontSize: sizes.lg, color: colors.textPrimary, margin: 0, lineHeight: 1.3 }}>{name}</p>
        {company && <p style={{ ...textVariants.caption, fontSize: sizes.sm, margin: "0.2rem 0 0" }}>{company}</p>}
      </div>
    </div>
  );
}
