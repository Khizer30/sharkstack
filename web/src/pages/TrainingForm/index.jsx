import { useEffect } from "react";
import Footer from "@/components/organisms/Footer";
import TrainingApplyForm from "@/components/organisms/TrainingApplyForm";
import { usePageTransition } from "@/context/PageTransition";

export default function TrainingForm() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <TrainingApplyForm />
      <Footer />
    </>
  );
}
