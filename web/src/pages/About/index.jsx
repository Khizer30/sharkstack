import { useEffect } from "react";
import AboutFounder from "@/components/organisms/AboutFounder";
import AboutHero from "@/components/organisms/AboutHero";
import AboutTeam from "@/components/organisms/AboutTeam";
import AboutValues from "@/components/organisms/AboutValues";
import BecomeSharkSection from "@/components/organisms/BecomeSharkSection";
import CTASection from "@/components/organisms/CTASection";
import ExploreProducts from "@/components/organisms/ExploreProducts";
import Footer from "@/components/organisms/Footer";
import ParallaxBanner from "@/components/organisms/ParallaxBanner";
import TestimonialsSection from "@/components/organisms/TestimonialsSection";
import TextBgReveal from "@/components/organisms/TextBgReveal";
import { aboutTextRevealContent, aboutMissionContent, trustBannerContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function About() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <AboutHero />
      <TextBgReveal label={aboutTextRevealContent.label} steps={aboutTextRevealContent.steps} staticBg="transparent" />
      <ParallaxBanner />
      <TextBgReveal label={aboutMissionContent.label} text={aboutMissionContent.text} animateColors={false} staticBg="transparent" showProgressBar />
      <AboutValues />
      <AboutTeam />
      <AboutFounder />
      <ExploreProducts />
      <TestimonialsSection />
      <ParallaxBanner content={trustBannerContent} showOverlay={false} rounded={false} />
      <BecomeSharkSection />
      <CTASection />
      <Footer />
    </>
  );
}
