import TerminalMockup from "./TerminalMockup";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

export default function CardLayer({ mainCardRef, terminalRef }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
      <div
        ref={mainCardRef}
        className="main-card deep-card gsap-reveal relative overflow-hidden flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
      >
        <div className="card-sheen" aria-hidden="true" />

        <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-2 items-center lg:gap-8 z-10 py-6 lg:py-0">
          <TerminalMockup terminalRef={terminalRef} />

          <div className="card-right gsap-reveal order-2 lg:order-2 flex justify-center lg:justify-end w-full">
            <div className="relative flex justify-end">
              <h2
                className="title-cooking card-title absolute top-0 right-0 uppercase tracking-tighter leading-none text-right"
                style={{ ...fonts.poppinsBold, fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900 }}
              >
                We're
                <br />
                brewing...
              </h2>
              <h2
                className="title-reinvented card-title uppercase tracking-tighter leading-none text-right"
                style={{ ...fonts.poppinsBold, fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900 }}
              >
                The stack,
                <br />
                <span style={{ color: colors.primary, WebkitTextFillColor: colors.primary }}>reinvented</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
