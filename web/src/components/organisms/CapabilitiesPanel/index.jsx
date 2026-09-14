import { forwardRef, useRef } from "react";
import TextReveal from "@/components/atoms/TextReveal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const TECH_IMGS = [
  "photo-1555066931-4365d14bab8c",
  "photo-1461749280684-dccba630e2f6",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1542831371-29b0f74f9713",
  "photo-1517694712202-14dd9538aa97",
  "photo-1581091226825-a6a2a5aee158",
  "photo-1573164713988-8665fc963095",
  "photo-1607706189992-eae578626c86",
  "photo-1504384308090-c894fdcc538d",
  "photo-1498050108023-c5249f4df085",
  "photo-1550751827-4bd374c3f58b",
  "photo-1563986768494-4dee2763ff3f"
];

const techImgUrl = (i) => `https://images.unsplash.com/${TECH_IMGS[i % TECH_IMGS.length]}?w=600&h=800&fit=crop&auto=format&q=80`;

const CapabilitiesPanel = forwardRef(function CapabilitiesPanel({ project }, ref) {
  const previewRef = useRef(null);
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const activeRef = useRef("a");
  const intervalRef = useRef(null);
  const cycleIdxRef = useRef(0);

  const crossFade = (url) => {
    const a = imgARef.current;
    const b = imgBRef.current;
    if (!a || !b) return;
    if (activeRef.current === "a") {
      b.src = url;
      requestAnimationFrame(() => {
        b.style.opacity = "1";
        a.style.opacity = "0";
      });
      activeRef.current = "b";
    } else {
      a.src = url;
      requestAnimationFrame(() => {
        a.style.opacity = "1";
        b.style.opacity = "0";
      });
      activeRef.current = "a";
    }
  };

  const showPreview = (e, i) => {
    if (parseFloat(e.currentTarget.style.opacity || 0) < 0.25) return;
    const el = previewRef.current;
    const a = imgARef.current;
    const b = imgBRef.current;
    if (!el || !a || !b) return;

    el.style.opacity = "1";
    el.style.transform = "translateY(-50%) translateX(0px) scale(1)";
    el.style.clipPath = "inset(0% 0% 0% 0% round 14px)";

    cycleIdxRef.current = i;
    a.src = techImgUrl(i);
    a.style.opacity = "1";
    b.style.opacity = "0";
    activeRef.current = "a";

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      cycleIdxRef.current = (cycleIdxRef.current + 1) % TECH_IMGS.length;
      crossFade(techImgUrl(cycleIdxRef.current));
    }, 520);
  };

  const hidePreview = () => {
    clearInterval(intervalRef.current);
    const el = previewRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(-50%) translateX(-14px) scale(0.96)";
    el.style.clipPath = "inset(6% 0% 6% 0% round 14px)";
  };

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        background: colors.black,
        display: "flex",
        flexDirection: "column",
        clipPath: "inset(100% 0 0 0)",
        opacity: 1,
        zIndex: 20,
        pointerEvents: "none"
      }}
    >
      <div
        data-cap-heading
        style={{
          padding: "3.5rem 2.5vw 0",
          flexShrink: 0,
          textAlign: "center",
          opacity: 0,
          transform: "translateY(20px)"
        }}
      >
        <TextReveal
          text="Capabilities"
          as="p"
          fontSize="clamp(2rem, 3vw, 2.7rem)"
          color={colors.white}
          hoverColor={colors.primary}
          style={{ margin: 0, letterSpacing: "-0.04em", padding: 0 }}
        />
      </div>

      <div
        ref={previewRef}
        style={{
          position: "absolute",
          left: "5vw",
          top: "50%",
          transform: "translateY(-50%) translateX(-14px) scale(0.96)",
          width: "23vw",
          height: "36vh",
          overflow: "hidden",
          borderRadius: "14px",
          clipPath: "inset(6% 0% 6% 0% round 14px)",
          opacity: 0,
          transition: "opacity 0.45s ease, transform 0.45s ease, clip-path 0.45s ease",
          pointerEvents: "none",
          zIndex: 6,
          boxShadow: `0 28px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)`
        }}
      >
        <img
          ref={imgARef}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.38s ease",
            opacity: 1
          }}
        />
        <img
          ref={imgBRef}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.38s ease",
            opacity: 0
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)"
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 26%, black 74%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 26%, black 74%, transparent 100%)"
        }}
      >
        {project.technologies?.map((tech, i) => (
          <div
            key={i}
            data-tech-item
            onMouseEnter={(e) => showPreview(e, i)}
            onMouseLeave={hidePreview}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.7rem 3vw 0.7rem 30vw",
              willChange: "transform, opacity, filter",
              borderBottom: `1px solid rgba(255,255,255,0.07)`
            }}
          >
            <span
              data-text
              style={{
                ...fonts.poppinsBold,
                fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                color: `${colors.white}20`,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                flex: 1
              }}
            >
              {tech}
            </span>
            <span
              data-num
              style={{
                ...fonts.poppinsBold,
                fontSize: "1rem",
                color: colors.primary,
                letterSpacing: "0.12em",
                opacity: 0,
                flexShrink: 0,
                marginLeft: "1.2rem"
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CapabilitiesPanel;
