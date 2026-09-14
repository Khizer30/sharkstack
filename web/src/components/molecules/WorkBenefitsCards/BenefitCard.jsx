import { HeartIcon, CalendarIcon, HomeIcon, BookIcon, ChartIcon, LaptopIcon, UsersIcon, SparkleIcon } from "@/assets/svgs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const ICONS = {
  heart: HeartIcon,
  calendar: CalendarIcon,
  home: HomeIcon,
  book: BookIcon,
  chart: ChartIcon,
  laptop: LaptopIcon,
  users: UsersIcon,
  sparkle: SparkleIcon
};

export default function BenefitCard({ card, active, onActivate }) {
  const Icon = ICONS[card.icon];

  return (
    <li
      className="group relative cursor-pointer overflow-hidden"
      style={{ borderRadius: "1rem", minHeight: 0, minWidth: 0 }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
        style={{
          transform: active ? "scale(1)" : "scale(1.12)",
          filter: active ? "grayscale(0)" : "grayscale(0.85)"
        }}
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.black}CC, ${colors.black}66 55%, transparent)` }} />

      <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: "1.25rem" }}>
        <h3
          className="hidden md:block"
          style={{
            ...fonts.montMedium,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: `${colors.white}CC`,
            transformOrigin: "left",
            transform: "rotate(90deg)",
            opacity: active ? 0 : 1,
            transition: "opacity 0.3s ease",
            whiteSpace: "nowrap",
            position: active ? "absolute" : "static"
          }}
        >
          {card.title}
        </h3>

        <div
          style={{
            color: colors.primary,
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s"
          }}
        >
          {Icon && <Icon size={22} />}
        </div>

        <h3
          style={{
            ...fonts.poppinsBold,
            color: colors.white,
            fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)",
            marginTop: "0.6rem",
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s"
          }}
        >
          {card.title}
        </h3>

        <p
          style={{
            ...fonts.montRegular,
            color: `${colors.white}CC`,
            fontSize: "0.9rem",
            lineHeight: 1.5,
            marginTop: "0.5rem",
            maxWidth: "20rem",
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s"
          }}
        >
          {card.desc}
        </p>
      </div>
    </li>
  );
}
