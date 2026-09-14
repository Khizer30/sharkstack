import Gallery from "@/components/molecules/LifeAtSharkStack/Gallery";
import TextHero from "@/components/molecules/LifeAtSharkStack/TextHero";
import VideoExpand from "@/components/molecules/LifeAtSharkStack/VideoExpand";
import ScrollRevealText from "@/components/molecules/ScrollRevealText";
import { lifeAtSharkStackText } from "@/content";

export default function LifeAtSharkStack() {
  return (
    <>
      <TextHero />
      <VideoExpand />
      <ScrollRevealText label="Our Culture" text={lifeAtSharkStackText} />
      <Gallery />
    </>
  );
}
