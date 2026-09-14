import { useNavigate, useLocation } from "react-router-dom";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { usePageTransition } from "@/context/PageTransition";
import { navigateToSection } from "@/utils/helpers";

export default function AnimatedNavLink({ to, children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  return (
    <button
      type="button"
      onClick={() => navigateToSection(to, navigate, pathname, transitionTo, transitionToSection)}
      className="group relative inline-block overflow-hidden bg-transparent border-none p-0 cursor-pointer"
      style={{ height: "1.1rem", lineHeight: "1.1rem", verticalAlign: "middle" }}
    >
      <div
        className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
        style={{ ...fonts.montMedium, fontSize: "0.875rem" }}
      >
        <span style={{ color: `${colors.white}80`, display: "block", lineHeight: "1.1rem" }}>{children}</span>
        <span style={{ color: colors.white, display: "block", lineHeight: "1.1rem" }}>{children}</span>
      </div>
    </button>
  );
}
