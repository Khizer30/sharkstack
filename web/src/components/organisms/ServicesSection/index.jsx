import FlowArt from "@/components/atoms/FlowArtServiceSection";
import CoreServices from "@/components/molecules/ServicesSection/CoreServices";
import HowItWorks from "@/components/molecules/ServicesSection/HowItWorks";
import ServicesIntro from "@/components/molecules/ServicesSection/ServicesIntro";
import WhatWeBuild from "@/components/molecules/ServicesSection/WhatWeBuild";
import WhySharkStack from "@/components/molecules/ServicesSection/WhySharkStack";

export default function ServicesSection() {
  return (
    <FlowArt aria-label="SharkStack Services">
      <ServicesIntro />
      <HowItWorks />
      <CoreServices />
      <WhatWeBuild />
      <WhySharkStack />
    </FlowArt>
  );
}
