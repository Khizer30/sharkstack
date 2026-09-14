import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts, sizes } from "@/constants/typography";

const GLOW = `0 0 60px rgba(240,90,40,0.12)`;

export default function MessageDisplay() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center z-[100] px-6">
      <div
        className="flex flex-col items-center text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
      >
        <span
          style={{
            ...fonts.montSemiBold,
            fontSize: sizes.xs,
            color: colors.primary,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1.25rem"
          }}
        >
          Error
        </span>

        <h1
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(7rem, 22vw, 16rem)",
            lineHeight: 0.9,
            color: colors.white,
            textShadow: GLOW,
            marginBottom: "1rem"
          }}
        >
          404
        </h1>

        <h2
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(1.25rem, 3vw, 2rem)",
            color: colors.white,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em"
          }}
        >
          Page not found.
        </h2>

        <p
          style={{
            ...fonts.montRegular,
            fontSize: sizes.sm,
            color: colors.slate400,
            maxWidth: "26rem",
            lineHeight: 1.7,
            marginBottom: "2.5rem"
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            style={{
              ...fonts.montSemiBold,
              fontSize: sizes.sm,
              color: colors.primary,
              border: `1.5px solid ${colors.primary}`,
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(240,90,40,0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <ArrowLeft /> Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              ...fonts.montSemiBold,
              fontSize: sizes.sm,
              color: colors.white,
              background: colors.primary,
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Go Home <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
