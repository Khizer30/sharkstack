import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function useComingSoonAnimation() {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const terminalRef = useRef(null);
  const rafRef = useRef(0);

  // Mouse → card sheen + terminal 3-D tilt
  useEffect(() => {
    const onMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!mainCardRef.current || !terminalRef.current) return;
        const rect = mainCardRef.current.getBoundingClientRect();
        mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(terminalRef.current, {
          rotationY: x * 10,
          rotationX: -y * 10,
          ease: "power3.out",
          duration: 1.2
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Cinematic scroll timeline
  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      // ── Initial states ──
      gsap.set(".text-track", {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: "blur(20px)",
        rotationX: -20
      });
      gsap.set(".text-reveal", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-right", ".terminal-wrap", ".term-line", ".prog-fill-el"], { autoAlpha: 0 });
      gsap.set(".title-reinvented", { autoAlpha: 0, y: 40, scale: 1.04 });
      gsap.set(".cta-section", {
        autoAlpha: 0,
        scale: 0.85,
        filter: "blur(30px)"
      });

      // ── Entrance animation ──
      gsap
        .timeline({ delay: 0.3 })
        .to(".text-track", {
          duration: 1.8,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          rotationX: 0,
          ease: "expo.out"
        })
        .to(".text-reveal", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      // ── Scroll timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });

      tl.to(
        [".hero-text", ".bg-grid"],
        {
          scale: 1.12,
          filter: "blur(18px)",
          opacity: 0.15,
          ease: "power2.inOut",
          duration: 2
        },
        0
      )
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", {
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5
        })
        .fromTo(
          ".terminal-wrap",
          {
            y: 280,
            z: -400,
            rotationX: 45,
            rotationY: -25,
            autoAlpha: 0,
            scale: 0.65
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.5
          },
          "-=0.8"
        )
        .fromTo(
          ".term-line",
          { y: 12, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.12,
            ease: "power2.out",
            duration: 1
          },
          "-=1.8"
        )
        .fromTo(".prog-fill-el", { width: "0%", autoAlpha: 0 }, { width: "87%", autoAlpha: 1, duration: 1.8, ease: "power3.inOut" }, "-=1.2")
        .fromTo(".card-right", { x: 50, autoAlpha: 0, scale: 0.85 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.4 }, "-=1.6")
        .to({}, { duration: 1.2 })
        .to(".title-cooking", {
          autoAlpha: 0,
          y: -40,
          scale: 0.96,
          filter: "blur(8px)",
          ease: "power3.inOut",
          duration: 1.4
        })
        .to(
          ".title-reinvented",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "expo.out",
            duration: 1.6
          },
          "-=1.1"
        )
        .to({}, { duration: 2 })
        .set(".hero-text", { autoAlpha: 0 })
        .set(".cta-section", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to([".terminal-wrap", ".card-right"], {
          scale: 0.88,
          y: -40,
          z: -200,
          autoAlpha: 0,
          ease: "power3.in",
          duration: 1.2,
          stagger: 0.05
        })
        .to(
          ".main-card",
          {
            width: isMobile ? "92vw" : "85vw",
            height: isMobile ? "92vh" : "85vh",
            borderRadius: isMobile ? "32px" : "40px",
            ease: "expo.inOut",
            duration: 1.8
          },
          "pullback"
        )
        .to(".cta-section", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", {
          y: -(window.innerHeight + 300),
          ease: "power3.in",
          duration: 1.5
        });

      ScrollTrigger.refresh();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return { containerRef, mainCardRef, terminalRef };
}
