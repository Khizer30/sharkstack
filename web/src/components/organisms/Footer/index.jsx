import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import ScrollingTicker from "@/components/atoms/ScrollingTicker";
import FooterAuroraGlow from "@/components/molecules/Footer/FooterAuroraGlow";
import FooterCredits from "@/components/molecules/Footer/FooterCredits";
import FooterGridOverlay from "@/components/molecules/Footer/FooterGridOverlay";
import FooterHero from "@/components/molecules/Footer/FooterHero";
import FooterWordmark from "@/components/molecules/Footer/FooterWordmark";
import { colors } from "@/constants/colors";
import { footerContent } from "@/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const wrapperRef = useRef(null);
  const giantRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantRef.current,
        { y: "8vh", opacity: 0 },
        { y: "0vh", opacity: 1, ease: "power1.out", scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", end: "bottom bottom", scrub: 1.2 } }
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", end: "bottom bottom", scrub: 1 }
        }
      );
    }, wrapperRef);

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "100vh", clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: colors.bgFooter,
          color: colors.cream,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        <FooterAuroraGlow />
        <FooterGridOverlay />
        <FooterWordmark innerRef={giantRef} />

        <div style={{ position: "relative", zIndex: 10, marginTop: "clamp(6rem, 12vw, 8rem)" }}>
          <ScrollingTicker items={footerContent.tickerItems} speed={40} />
        </div>

        <FooterHero headingRef={headingRef} linksRef={linksRef} />

        <FooterCredits />
      </footer>
    </div>
  );
}
