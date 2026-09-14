import { useState, useEffect } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function RevealDescription({ children, className }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <p
      className={className}
      style={{
        ...fonts.montRegular,
        color: colors.white,
        lineHeight: 1.6,
        fontSize: "1.05rem",
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {children}
    </p>
  );
}
