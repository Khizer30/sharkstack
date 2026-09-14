import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, lazy } from "react";
import DeferredMount from "@/components/atoms/DeferredMount";
import HeroSection from "@/components/organisms/HeroSection";
import PortfolioSection from "@/components/organisms/PortfolioSection";
import ProcessRow from "@/components/organisms/ProcessRow";
import PyramidSection from "@/components/organisms/PyramidSection";
import ScrollExpandSection from "@/components/organisms/ScrollExpandSection";
import ServicesSection from "@/components/organisms/ServicesSection";
import { colors } from "@/constants/colors";
import { tickerContent, trustBannerContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

const LifeAtSharkStack = lazy(() => import("@/components/organisms/LifeAtSharkStack"));
const TextTicker = lazy(() => import("@/components/atoms/TextTicker"));
const TextBgReveal = lazy(() => import("@/components/organisms/TextBgReveal"));
const StatsSection = lazy(() => import("@/components/organisms/StatsSection"));
const TechImpactSection = lazy(() => import("@/components/organisms/TechImpactSection"));
const CTASection = lazy(() => import("@/components/organisms/CTASection"));
const BookCallSection = lazy(() => import("@/components/organisms/BookCallSection"));
const ClientGlobeSection = lazy(() => import("@/components/organisms/ClientGlobeSection"));
const TestimonialsSection = lazy(() => import("@/components/organisms/TestimonialsSection"));
const ClientsWorldMapSection = lazy(() => import("@/components/organisms/ClientsWorldMapSection"));
const ParallaxBanner = lazy(() => import("@/components/organisms/ParallaxBanner"));
const Footer = lazy(() => import("@/components/organisms/Footer"));

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const portfolioRef = useRef(null);
  const portfolioSpacerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: portfolioRef.current,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacer: portfolioSpacerRef.current,
        pinSpacing: false
      });
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <>
      <div id="hero">
        <HeroSection />
      </div>
      <PyramidSection />
      <div id="process">
        <ScrollExpandSection />
      </div>
      <ProcessRow />
      <div id="services" style={{ position: "relative", zIndex: 6, marginTop: "-100vh" }}>
        <ServicesSection />
      </div>
      <div ref={portfolioSpacerRef} style={{ position: "relative", zIndex: 1 }}>
        <div ref={portfolioRef}>
          <PortfolioSection />
        </div>
      </div>
      <div id="life" style={{ position: "relative", zIndex: 10 }}>
        <DeferredMount minHeight="100vh">
          <LifeAtSharkStack />
        </DeferredMount>
      </div>
      <div style={{ background: colors.white, padding: "2rem 0" }}>
        <DeferredMount minHeight="4rem">
          <TextTicker items={tickerContent.items} speed={32} />
        </DeferredMount>
      </div>
      <DeferredMount minHeight="100vh">
        <TextBgReveal />
      </DeferredMount>
      <DeferredMount minHeight="350vh">
        <StatsSection />
      </DeferredMount>
      <DeferredMount minHeight="125vh">
        <TechImpactSection />
      </DeferredMount>
      <div style={{ height: "12vh", background: colors.bgDark }} />
      <div id="clients">
        <DeferredMount minHeight="100vh">
          <ClientGlobeSection />
        </DeferredMount>
      </div>
      <DeferredMount minHeight="100vh">
        <TestimonialsSection />
      </DeferredMount>
      <DeferredMount minHeight="130vh">
        <ClientsWorldMapSection />
      </DeferredMount>
      <DeferredMount minHeight="80vh">
        <ParallaxBanner content={trustBannerContent} showOverlay={false} rounded={false} />
      </DeferredMount>
      <div id="book-call">
        <DeferredMount minHeight="60vh">
          <BookCallSection />
        </DeferredMount>
      </div>
      <div id="cta">
        <DeferredMount minHeight="60vh">
          <CTASection />
        </DeferredMount>
      </div>
      <DeferredMount minHeight="40vh">
        <Footer />
      </DeferredMount>
    </>
  );
}
