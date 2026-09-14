import { useEffect } from "react";
import Footer from "@/components/organisms/Footer";
import LegalPageContent from "@/components/organisms/LegalPageContent";
import { privacyContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function Privacy() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <LegalPageContent {...privacyContent} />
      <Footer />
    </>
  );
}
