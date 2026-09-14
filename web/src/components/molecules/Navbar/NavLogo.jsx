import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { navigateToSection } from "@/utils/helpers";

export default function NavLogo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <button
      type="button"
      onClick={() => navigateToSection("#hero", navigate, pathname)}
      className="flex items-center gap-2 shrink-0 bg-transparent border-none p-0 cursor-pointer"
    >
      <img src={logo} alt="SharkStack" style={{ height: "1.75rem", width: "auto", objectFit: "contain" }} />
      <span style={{ ...fonts.montSemiBold, fontSize: "1.1rem", color: colors.white }}>SharkStack</span>
    </button>
  );
}
