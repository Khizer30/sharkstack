import { useEffect } from "react";
import BecomeSharkSection from "@/components/organisms/BecomeSharkSection";
import Footer from "@/components/organisms/Footer";
import TrainingFeature from "@/components/organisms/TrainingFeature";
import { usePageTransition } from "@/context/PageTransition";

export default function Training() {
  const { revealPage, transitionTo } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <TrainingFeature />
      <BecomeSharkSection
        heading="Ready to dive in?"
        subtext="Applications for the 15 September AI Masterclass cohort are open. Grab your spot before the batch fills up."
        buttonLabel="Join the wait-list"
        onButtonClick={() => transitionTo("/ai-training/form")}
      />
      <Footer />
    </>
  );
}
