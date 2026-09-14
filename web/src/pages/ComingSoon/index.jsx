import CardLayer from "@/components/molecules/ComingSoonPage/CardLayer";
import CtaLayer from "@/components/molecules/ComingSoonPage/CtaLayer";
import HeroLayer from "@/components/molecules/ComingSoonPage/HeroLayer";
import { makeStyles } from "@/components/molecules/ComingSoonPage/styles";
import useComingSoonAnimation from "@/components/molecules/ComingSoonPage/useComingSoonAnimation";
import { colors } from "@/constants/colors";

export default function ComingSoon() {
  const { containerRef, mainCardRef, terminalRef } = useComingSoonAnimation();

  return (
    <div ref={containerRef} className="relative w-screen" style={{ height: "800vh", background: colors.bgBrand }}>
      <style dangerouslySetInnerHTML={{ __html: makeStyles() }} />

      <div className="sticky top-0 w-screen h-screen overflow-hidden flex items-center justify-center" style={{ perspective: "1500px" }}>
        <div className="film-grain" aria-hidden="true" />
        <div className="bg-grid absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

        <HeroLayer />
        <CtaLayer />
        <CardLayer mainCardRef={mainCardRef} terminalRef={terminalRef} />
      </div>
    </div>
  );
}
