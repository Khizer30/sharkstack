import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "@/assets/svgs";
import DotsToPlusIcon from "@/components/atoms/DotsToPlusIcon";
import NavLinks from "@/components/molecules/Navbar/NavLinks";
import NavLogo from "@/components/molecules/Navbar/NavLogo";
import SocialPageOverlay from "@/components/organisms/SocialPageOverlay";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { navContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { navigateToSection } from "@/utils/helpers";

export default function Navbar() {
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  return (
    <>
      <header
        className="fixed top-4 left-4 right-4 z-50 rounded-2xl"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: `${colors.black}CC`,
          border: `1px solid ${colors.white}1A`
        }}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center w-full gap-6" style={{ padding: "0.75rem 1.5rem" }}>
          <NavLogo />

          <div className="hidden lg:flex justify-center">
            <NavLinks links={navContent.links} />
          </div>

          <div className="relative flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigateToSection("#book-call", navigate, pathname, transitionTo, transitionToSection)}
              className="hidden lg:inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.8rem",
                color: colors.white,
                backgroundColor: `${colors.white}1A`,
                border: "none",
                padding: "0.3rem 0.3rem 0.3rem 1rem",
                gap: "0.6rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.white}1A`;
              }}
            >
              Book a Call
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "1.75rem", height: "1.75rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
              >
                <ArrowRight size={13} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => transitionTo("/careers")}
              className="hidden lg:inline-flex items-center rounded-full transition-colors duration-300 cursor-pointer"
              style={{
                ...fonts.montSemiBold,
                fontSize: "0.8rem",
                color: colors.white,
                backgroundColor: `${colors.white}1A`,
                border: "none",
                padding: "0.3rem 0.3rem 0.3rem 1rem",
                gap: "0.6rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.white}1A`;
              }}
            >
              Careers
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "1.75rem", height: "1.75rem", backgroundColor: `${colors.white}1F`, color: colors.white }}
              >
                <ArrowRight size={13} />
              </span>
            </button>

            <div
              className="hidden lg:flex items-center justify-center rounded-full transition-colors duration-300 shrink-0"
              style={{ width: "2.5rem", height: "2.5rem", backgroundColor: `${colors.white}1A` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.white}1A`;
              }}
            >
              <DotsToPlusIcon onClick={() => setShowOverlay(true)} />
            </div>

            <div className="lg:hidden">
              <DotsToPlusIcon onClick={() => setShowOverlay(true)} />
            </div>
          </div>
        </div>
      </header>

      {showOverlay && <SocialPageOverlay onClose={() => setShowOverlay(false)} />}
    </>
  );
}
