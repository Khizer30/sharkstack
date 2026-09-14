import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@/assets/svgs";
import { colors } from "@/constants/colors";

export default function NavButton({ direction, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center rounded-full shrink-0 cursor-pointer overflow-hidden"
      style={{
        width: "3rem",
        height: "3rem",
        border: `1px solid ${hovered ? colors.primary : `${colors.white}20`}`,
        background: hovered ? colors.primary : "transparent",
        color: hovered ? colors.black : colors.white,
        transition: "background-color 0.3s, border-color 0.3s, color 0.3s"
      }}
    >
      <Icon size={17} />
    </button>
  );
}
