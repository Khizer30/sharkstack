import { useState } from "react";
import ContactDrawer from "./ContactDrawer";
import { ArrowUpRight } from "@/assets/svgs";
import OutlinePill from "@/components/atoms/OutlinePill";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { footerContent } from "@/content";

function ArrowCircle() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(2.5rem, 5vw, 5rem)",
        height: "clamp(2.5rem, 5vw, 5rem)",
        border: `1.5px solid ${colors.cream}30`,
        borderRadius: "50%",
        flexShrink: 0,
        marginTop: "0.3rem",
        transition: "border-color 0.25s, background-color 0.25s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.backgroundColor = `${colors.primary}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.cream}30`;
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <ArrowUpRight size="36%" />
    </span>
  );
}

export default function FooterHero({ headingRef, linksRef }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem)",
          marginTop: "4rem",
          gap: "clamp(2rem, 4vw, 3.5rem)"
        }}
      >
        <button
          ref={headingRef}
          onClick={() => setDrawerOpen(true)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(0.5rem, 1.5vw, 1.5rem)"
          }}
        >
          <span
            style={{
              ...fonts.poppinsBold,
              fontSize: "clamp(3rem, 10vw, 10rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textAlign: "center",
              background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.cream}66 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 20px ${colors.cream}26)`
            }}
          >
            Reach out to us.
          </span>
          <ArrowCircle />
        </button>

        <div ref={linksRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            {footerContent.links.map(({ label, href }) => (
              <OutlinePill key={href} href={href}>
                {label}
              </OutlinePill>
            ))}
          </div>
        </div>
      </div>

      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
