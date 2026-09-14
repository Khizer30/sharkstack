import { useEffect } from "react";
import Footer from "@/components/organisms/Footer";
import LegalPageContent from "@/components/organisms/LegalPageContent";
import { refundContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";

export default function Refunds() {
  const { revealPage } = usePageTransition();
  useEffect(() => {
    revealPage();
  }, [revealPage]);

  return (
    <>
      <LegalPageContent {...refundContent} />
      <Footer />
    </>
  );
}
