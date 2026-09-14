import gsap from "gsap";
import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContactUsBox from "@/components/atoms/ContactUsBox";
import SocialCrossBox from "@/components/atoms/SocialCrossBox";
import SocialLinksBox from "@/components/atoms/SocialLinksBox";
import SocialMenuLinksBox from "@/components/atoms/SocialMenuLinksBox";
import SocialVideoBox from "@/components/atoms/SocialVideoBox";
import { colors } from "@/constants/colors";
import { navContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { navigateToSection } from "@/utils/helpers";

const overlayLinks = [{ label: "Home", to: "#hero" }, ...navContent.links, { label: "Book a Call", to: "#book-call" }, { label: "Careers", to: "/careers" }];

export default function SocialPageOverlay({ onClose }) {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const activeBoxId = useRef(null);

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const backdropRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  const handleCrossClose = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    const container = containerRef.current;
    const content = contentRef.current;
    const backdrop = backdropRef.current;

    if (!container || !content) {
      onClose();
      return;
    }

    gsap.killTweensOf([container, content, backdrop]);

    gsap
      .timeline({ defaults: { ease: "power3.inOut" }, onComplete: onClose })
      .to(content, { opacity: 0, y: -20, scale: 0.97, duration: 0.5, ease: "power2.inOut" }, 0)
      .to(container, { y: "-100%", opacity: 0, duration: 0.7 }, 0.1)
      .to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.2);
  }, [isExiting, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const content = contentRef.current;
    const backdrop = backdropRef.current;

    if (container && content) {
      gsap.killTweensOf([container, content, backdrop]);

      gsap.set(container, { y: "-100%", opacity: 1 });
      gsap.set(content, { opacity: 0, y: 30, scale: 0.98 });
      gsap.set(backdrop, { opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(backdrop, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
        .to(container, { y: "0%", duration: 0.9, ease: "back.out(1.2)" }, 0.1)
        .to(content, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.6)" }, 0.3);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBoxHover = (boxId) => {
    if (activeBoxId.current === boxId || isExiting) return;

    const prevBoxId = activeBoxId.current;
    activeBoxId.current = boxId;

    const getBox = (id) => (id === "box1" ? box1Ref : id === "box2" ? box2Ref : id === "box3" ? box3Ref : null);

    const prevBox = getBox(prevBoxId);
    const targetBox = getBox(boxId);

    if (prevBox?.current) {
      gsap.killTweensOf(prevBox.current);
      gsap.to(prevBox.current, { height: "150px", duration: 0.25, ease: "power2.out" });
    }

    if (targetBox?.current) {
      gsap.killTweensOf(targetBox.current);
      gsap.to(targetBox.current, { height: "200px", duration: 0.3, ease: "power2.out" });
    }
  };

  const handleBoxLeave = () => {
    if (!activeBoxId.current) return;

    const getBox = (id) => (id === "box1" ? box1Ref : id === "box2" ? box2Ref : box3Ref);
    const currentBox = getBox(activeBoxId.current);

    if (currentBox?.current) {
      gsap.killTweensOf(currentBox.current);
      gsap.to(currentBox.current, { height: "150px", duration: 0.25, ease: "power2.out" });
    }

    activeBoxId.current = null;
  };

  const handleMenuLinkClick = useCallback(
    (label) => {
      const link = overlayLinks.find((l) => l.label === label);
      if (link) navigateToSection(link.to, navigate, pathname, transitionTo, transitionToSection);
      handleCrossClose();
    },
    [navigate, pathname, transitionTo, transitionToSection, handleCrossClose]
  );

  const handleContactNavigate = useCallback(() => {
    navigateToSection("#cta", navigate, pathname, transitionTo, transitionToSection);
    handleCrossClose();
  }, [navigate, pathname, transitionTo, transitionToSection, handleCrossClose]);

  const activeLabel = overlayLinks.find((l) => l.to !== "/" && pathname.startsWith(l.to))?.label ?? (pathname === "/" ? "Home" : undefined);

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 backdrop-blur-sm z-[998]"
        style={{ opacity: 0, backgroundColor: `${colors.pyramidBg2}E6` }}
        onClick={handleCrossClose}
      />

      <div ref={containerRef} className="fixed inset-0 z-[999] overflow-y-auto" style={{ transform: "translateY(-100%)", backgroundColor: colors.pyramidBg2 }}>
        <div ref={contentRef} className="w-full min-h-screen" style={{ opacity: 0, transform: "translateY(30px) scale(0.98)" }}>
          <div className="min-h-screen p-6 relative">
            <div className="flex flex-col gap-6 lg:hidden">
              <div className="absolute top-4 right-4 w-[30%] z-20">
                <SocialCrossBox ref={box2Ref} onHover={() => handleBoxHover("box2")} onLeave={handleBoxLeave} onClose={handleCrossClose} />
              </div>

              <div className="mt-[166px]">
                <SocialMenuLinksBox links={overlayLinks.map((l) => l.label)} activeLink={activeLabel} onLinkClick={handleMenuLinkClick} />
              </div>

              <div style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
                <SocialLinksBox />
              </div>

              <div className="space-y-0">
                <ContactUsBox ref={box3Ref} onHover={() => handleBoxHover("box3")} onLeave={handleBoxLeave} onNavigate={handleContactNavigate} />
                <SocialVideoBox ref={box1Ref} onHover={() => handleBoxHover("box1")} onLeave={handleBoxLeave} />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="absolute top-6 left-6 right-6 h-[150px] z-10">
                <div className="grid grid-cols-3 gap-1 h-full">
                  <SocialVideoBox ref={box1Ref} onHover={() => handleBoxHover("box1")} onLeave={handleBoxLeave} />
                  <SocialCrossBox ref={box2Ref} onHover={() => handleBoxHover("box2")} onLeave={handleBoxLeave} onClose={handleCrossClose} />
                  <ContactUsBox ref={box3Ref} onHover={() => handleBoxHover("box3")} onLeave={handleBoxLeave} onNavigate={handleContactNavigate} />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end gap-12">
                  <div className="w-7/12">
                    <SocialMenuLinksBox links={overlayLinks.map((l) => l.label)} activeLink={activeLabel} onLinkClick={handleMenuLinkClick} />
                  </div>

                  <div className="w-4/12 flex justify-end">
                    <div className="w-full max-w-[400px]">
                      <SocialLinksBox />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
