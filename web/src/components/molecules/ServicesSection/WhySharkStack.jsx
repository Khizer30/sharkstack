import { Hr, labelStyle, ServiceContentBody, useServiceContent } from "./shared";
import { FlowSection } from "@/components/atoms/FlowArtServiceSection";
import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { uiuxDesignContent } from "@/content";

const { title, label, heading } = uiuxDesignContent;

export default function WhySharkStack() {
  const { status, body, cols } = useServiceContent(title);

  return (
    <FlowSection aria-label={label} style={{ backgroundColor: colors.bgDark, color: colors.white }}>
      <p style={labelStyle}>{label}</p>
      <Hr />
      <div style={{ letterSpacing: "-0.03em", lineHeight: 0.88 }}>
        {heading.map((line, i) => (
          <div key={i}>
            <TextReveal text={line} fontSize="clamp(2.4rem, 11vw, 13rem)" color={colors.white} hoverColor={colors.primary} style={{ padding: 0 }} />
          </div>
        ))}
      </div>
      <Hr />
      <ServiceContentBody status={status} body={body} cols={cols} textColor={colors.white} />
    </FlowSection>
  );
}
