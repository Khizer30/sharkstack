import { useEffect } from "react";
import Footer from "@/components/organisms/Footer";
import LegalPageContent from "@/components/organisms/LegalPageContent";
import { termsContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function Terms() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <LegalPageContent {...termsContent} />
      <Footer />
    </>
  );
}
