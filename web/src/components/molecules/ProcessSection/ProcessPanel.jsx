import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { processContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { navigateToSection } from "@/utils/helpers";

const { panel } = processContent;

export default function ProcessPanel() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  return (
    <div className="ps-panel">
      <div className="ps-panel-inner">
        <p className="ps-panel-tag">{panel.tag}</p>
        <h3
          className="ps-panel-heading"
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em"
          }}
        >
          {panel.heading}
        </h3>
        <p className="ps-panel-body" style={{ ...fonts.montRegular, fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)" }}>
          {panel.body}
        </p>

        <button
          type="button"
          onClick={() => navigateToSection("#book-call", navigate, pathname, transitionTo, transitionToSection)}
          className="md:hidden inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
          style={{
            ...fonts.montSemiBold,
            fontSize: "0.95rem",
            color: colors.white,
            backgroundColor: `${colors.black}33`,
            border: `1px solid ${colors.white}33`,
            padding: "0.4rem 0.4rem 0.4rem 1.25rem",
            gap: "0.75rem"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.black}55`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.black}33`;
          }}
        >
          Book a Call
          <span
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: "2.1rem", height: "2.1rem", backgroundColor: `${colors.white}26`, color: colors.white }}
          >
            <ArrowRight size={15} />
          </span>
        </button>
      </div>
    </div>
  );
}
