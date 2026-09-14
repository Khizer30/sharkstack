import { fonts } from "@/constants/typography";

export default function HeroLayer() {
  const headingStyle = { ...fonts.poppinsBold, fontSize: "clamp(4rem, 12vw, 10rem)" };
  return (
    <div className="hero-text absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4">
      <h1 className="text-track gsap-reveal hero-title-1 tracking-tight mb-2" style={headingStyle}>
        SharkStack
      </h1>
    </div>
  );
}
