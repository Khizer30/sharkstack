import { useEffect, useLayoutEffect, useState } from "react";
import PortfolioCarousel from "@/components/organisms/PortfolioCarousel";
import { usePageTransition } from "@/context/PageTransition";

export default function Portfolio() {
  const [ready, setReady] = useState(false);
  const { revealPage } = usePageTransition();

  useLayoutEffect(() => {
    const lenis = window["__lenis"];
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      document.documentElement.scrollTop = 0;
    }
    setReady(true);
  }, []);

  useEffect(() => {
    revealPage();
  }, [revealPage]);

  if (!ready) return null;
  return <PortfolioCarousel />;
}
