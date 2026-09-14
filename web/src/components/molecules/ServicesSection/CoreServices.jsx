import { Hr, labelStyle, ServiceContentBody, useServiceContent } from "./shared";
import { FlowSection } from "@/components/atoms/FlowArtServiceSection";
import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { backendApisContent } from "@/content";

const { title, label, heading } = backendApisContent;

export default function CoreServices() {
  const { status, body, cols } = useServiceContent(title);

  return (
    <FlowSection aria-label={label} style={{ backgroundColor: colors.primary, color: colors.white }}>
      <p style={labelStyle}>{label}</p>
      <Hr color={`${colors.white}40`} />
      <div style={{ letterSpacing: "-0.03em", lineHeight: 0.88 }}>
        {heading.map((line, i) => (
          <div key={i}>
            <TextReveal text={line} fontSize="clamp(2.4rem, 11vw, 13rem)" color={colors.white} hoverColor={`${colors.white}80`} style={{ padding: 0 }} />
          </div>
        ))}
      </div>
      <Hr color={`${colors.white}40`} />
      <ServiceContentBody status={status} body={body} cols={cols} textColor={colors.white} hrColor={`${colors.white}40`} />
    </FlowSection>
  );
}
