import TextTicker from "@/components/atoms/TextTicker";
import { colors } from "@/constants/colors";
import { careerMarqueeContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function CareerMarquee() {
  const isMobile = useIsMobile();

  return (
    <div
      className="relative w-full flex items-start"
      style={{
        minHeight: isMobile ? "26vh" : "52vh",
        marginTop: isMobile ? 0 : "-100vh",
        paddingTop: isMobile ? "clamp(6rem, 20vw, 7rem)" : "clamp(7.5rem, 12vw, 9.5rem)",
        paddingBottom: isMobile ? "clamp(1.5rem, 5vw, 2rem)" : "clamp(3rem, 6vw, 4.5rem)",
        background: colors.bgBrand,
        overflow: "hidden",
        zIndex: 2
      }}
    >
      <TextTicker items={careerMarqueeContent.items} textColor={colors.white} markColor={colors.primary} scrollLinked={!isMobile} sensitivity={1.1} />
    </div>
  );
}
