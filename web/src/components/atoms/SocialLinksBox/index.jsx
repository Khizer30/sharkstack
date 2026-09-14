import gsap from "gsap";
import { useRef, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { footerContent } from "@/content";

const [emailLink, ...socialLinks] = footerContent.links;

export default function SocialLinksBox() {
  const [time, setTime] = useState("");
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const BASE_DELAY = 0.6;

    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(containerRef.current.querySelectorAll(".animate-text"), { opacity: 0, y: 20, filter: "blur(10px)" });
    gsap.set(containerRef.current.querySelectorAll(".animate-bullet"), { opacity: 0, scale: 0, rotation: -45 });

    containerRef.current.querySelectorAll(".animate-text").forEach((el, index) => {
      const finalOpacity = parseFloat(el.dataset.finalOpacity ?? "1");
      timelineRef.current.to(el, { opacity: finalOpacity, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }, BASE_DELAY + index * 0.08);
    });

    containerRef.current.querySelectorAll(".animate-bullet").forEach((el, index) => {
      timelineRef.current.to(el, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }, BASE_DELAY + index * 0.08 + 0.05);
    });

    return () => timelineRef.current?.kill();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6 relative px-4 sm:px-0">
      <ContactLink label={emailLink.label} href={emailLink.href} />

      <div className="flex items-end justify-between gap-8">
        <div className="space-y-2 pl-5">
          <h3 className="animate-text" style={{ ...fonts.montMedium, fontSize: "0.75rem", color: colors.white }}>
            Social
          </h3>
          <div className="space-y-1">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} label={link.label} href={link.href} />
            ))}
          </div>
        </div>

        <span className="animate-text whitespace-nowrap" style={{ ...fonts.montRegular, fontSize: "0.8rem", color: colors.white }}>
          {time}
        </span>
      </div>
    </div>
  );
}

function ContactLink({ label, href }) {
  const linkRef = useRef(null);
  const underlineRef = useRef(null);
  const textRef = useRef(null);

  const handleHover = () => {
    gsap.to(linkRef.current, { x: 5, duration: 0.2, ease: "power2.out" });
    gsap.to(underlineRef.current, { width: "100%", duration: 0.2, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(linkRef.current, { x: 0, duration: 0.2, ease: "power2.out" });
    gsap.to(underlineRef.current, { width: 0, duration: 0.2, ease: "power2.out" });
  };

  return (
    <a ref={linkRef} href={href} className="flex items-center gap-2 cursor-pointer w-fit" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <span className="animate-bullet" style={{ fontSize: "0.5rem", color: colors.primary }}>
        ✦
      </span>
      <span ref={textRef} className="animate-text relative inline-block" style={{ ...fonts.montRegular, fontSize: "0.85rem", color: colors.white }}>
        {label}
        <div ref={underlineRef} className="absolute bottom-0 left-0 h-px" style={{ width: 0, backgroundColor: colors.white }} />
      </span>
    </a>
  );
}

function SocialLink({ label, href }) {
  const linkRef = useRef(null);
  const underlineRef = useRef(null);
  const textRef = useRef(null);

  const handleHover = () => {
    gsap.to(linkRef.current, { x: 5, duration: 0.2, ease: "power2.out" });
    gsap.to(underlineRef.current, { width: "100%", duration: 0.2, ease: "power2.out" });
    gsap.to(textRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(linkRef.current, { x: 0, duration: 0.2, ease: "power2.out" });
    gsap.to(underlineRef.current, { width: 0, duration: 0.2, ease: "power2.out" });
    gsap.to(textRef.current, { opacity: 0.6, duration: 0.2, ease: "power2.out" });
  };

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer w-fit block"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div
        ref={textRef}
        data-final-opacity="0.6"
        className="animate-text relative inline-block"
        style={{ ...fonts.montRegular, fontSize: "0.85rem", color: colors.white, opacity: 0.6 }}
      >
        {label}
        <div ref={underlineRef} className="absolute bottom-0 left-0 h-px" style={{ width: 0, backgroundColor: colors.white }} />
      </div>
    </a>
  );
}
