import { ArrowUpRight } from "@/assets/svgs";
import RevealDescription from "@/components/atoms/RevealDescription";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function ValueRow({ value, index, isActive, isMobile, rowRef, onMouseEnter }) {
  return (
    <div
      ref={rowRef}
      data-index={index}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      className="cursor-pointer relative w-full grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-center py-8 md:py-6"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: colors.primary,
          transformOrigin: "left",
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.4s ease"
        }}
      />

      {isActive && <RevealDescription className="order-2 md:order-1 md:col-start-1">{value.desc}</RevealDescription>}

      <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:justify-between order-1 md:order-2 md:col-start-2">
        {isMobile && (
          <img
            src={value.image}
            alt={value.title}
            className="w-full h-56 object-cover rounded-2xl"
            style={{ marginTop: "2rem", boxShadow: `0 20px 40px -12px ${colors.black}80`, border: `1px solid ${colors.white}1A` }}
          />
        )}

        <h3
          className="uppercase relative"
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
            color: isActive ? colors.white : `${colors.white}33`,
            mixBlendMode: isActive && !isMobile ? "difference" : "normal",
            zIndex: isActive ? 20 : "auto",
            transition: "color 0.3s ease"
          }}
        >
          {value.title}
        </h3>

        {!isMobile && (
          <span
            className="relative"
            style={{
              color: isActive ? colors.black : "transparent",
              background: isActive ? colors.white : "transparent",
              borderRadius: "9999px",
              padding: "0.75rem",
              mixBlendMode: isActive ? "difference" : "normal",
              zIndex: isActive ? 20 : "auto",
              transition: "color 0.3s ease, background 0.3s ease"
            }}
          >
            <ArrowUpRight size={28} />
          </span>
        )}
      </div>
    </div>
  );
}
