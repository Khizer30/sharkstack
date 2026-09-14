import { useEffect } from "react";
import BecomeSharkSection from "@/components/organisms/BecomeSharkSection";
import CareerApply from "@/components/organisms/CareerApply";
import CareerFocusCards from "@/components/organisms/CareerFocusCards";
import CareerHero from "@/components/organisms/CareerHero";
import CareerMarquee from "@/components/organisms/CareerMarquee";
import EmployeeReviews from "@/components/organisms/EmployeeReviews";
import Footer from "@/components/organisms/Footer";
import HiringProcess from "@/components/organisms/HiringProcess";
import OpenRoles from "@/components/organisms/OpenRoles";
import WhySharkScroll from "@/components/organisms/WhySharkScroll";
import WorkBenefitsCards from "@/components/organisms/WorkBenefitsCards";
import { usePageTransition } from "@/context/PageTransition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollToId } from "@/utils/helpers";

export default function Careers() {
  const { revealPage } = usePageTransition();
  const isMobile = useIsMobile();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <div style={{ position: "relative", height: isMobile ? "auto" : "220vh" }}>
        <CareerHero />
      </div>
      <CareerMarquee />
      <WorkBenefitsCards />
      <CareerFocusCards />
      <WhySharkScroll />
      <HiringProcess />
      <OpenRoles />
      <EmployeeReviews />
      <BecomeSharkSection
        heading="Ready to dive in?"
        subtext="Found a role that fits? Reach out and let's talk about where you'd land on the crew."
        buttonLabel="View open positions"
        onButtonClick={() => scrollToId("roles")}
      />
      <CareerApply />
      <Footer />
    </>
  );
}
