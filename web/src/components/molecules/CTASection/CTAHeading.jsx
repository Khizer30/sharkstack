import { useState } from "react";
import { ArrowUpRight } from "@/assets/svgs";
import ContactDrawer from "@/components/molecules/Footer/ContactDrawer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { ctaContent } from "@/content";

function ArrowButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Open contact form"
      style={{
        width: "clamp(1.75rem, 9vw, 5.5rem)",
        height: "clamp(1.75rem, 9vw, 5.5rem)",
        borderRadius: "50%",
        border: `1px solid ${colors.cream}40`,
        backgroundColor: hovered ? `${colors.cream}12` : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        marginLeft: "clamp(0.5rem, 2vw, 2rem)",
        marginTop: "0.3rem",
        transition: "background-color 0.25s, border-color 0.25s, transform 0.25s",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        color: colors.cream
      }}
    >
      <ArrowUpRight size="36%" />
    </button>
  );
}

export default function CTAHeading() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lines = ctaContent.heading.split("\n");

  return (
    <>
      <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", marginBottom: "clamp(1.5rem, 3vw, 3rem)" }}>
        <h2
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(2.25rem, 12vw, 12rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: colors.cream,
            margin: 0
          }}
        >
          {lines.map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </h2>
        <ArrowButton onClick={() => setDrawerOpen(true)} />
      </div>

      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
