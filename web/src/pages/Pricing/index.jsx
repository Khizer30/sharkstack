import { useEffect } from "react";
import CTASection from "@/components/organisms/CTASection";
import Footer from "@/components/organisms/Footer";
import PricingSection from "@/components/organisms/PricingSection";
import { usePageTransition } from "@/context/PageTransition";

export default function Pricing() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}
