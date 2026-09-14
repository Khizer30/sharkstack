import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientGlobeSection from "@/components/organisms/ClientGlobeSection";
import CTASection from "@/components/organisms/CTASection";
import Footer from "@/components/organisms/Footer";
import ProjectHero from "@/components/organisms/ProjectHero";
import TechImpactSection from "@/components/organisms/TechImpactSection";
import TestimonialsSection from "@/components/organisms/TestimonialsSection";
import { usePageTransition } from "@/context/PageTransition";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useProjectScroll } from "@/hooks/useProjectScroll";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, status } = usePortfolios();
  const project = projects.find((p) => p.id === id);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scroll = useProjectScroll({ project: project ?? {}, isMobile });
  const { revealPage } = usePageTransition();

  useLayoutEffect(() => {
    const lenis = window["__lenis"];
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, []);
  useEffect(() => {
    revealPage();
  }, []);
  useEffect(() => {
    if (status === "succeeded" && !project) navigate("/portfolio", { replace: true });
  }, [status, project, navigate]);
  useEffect(() => {
    const prev = document.documentElement.style.scrollbarWidth;
    document.documentElement.style.scrollbarWidth = "none";
    return () => {
      document.documentElement.style.scrollbarWidth = prev;
    };
  }, []);

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; }
        html::-webkit-scrollbar { display: none; }
        [data-tech-item] { transition: background 0.45s ease; }
        [data-tech-item] [data-text]       { transition: color 0.45s ease; }
        [data-tech-item] [data-num]        { transition: color 0.45s ease; }
        [data-tech-item] [data-active-bar] { transition: opacity 0.35s ease; }
        [data-tech-dot]       { transition: background 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease; }
        [data-tech-line-fill] { transition: height 0.4s ease; }
        @keyframes ticker-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes ticker-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
      `}</style>

      <ProjectHero project={project ?? {}} isMobile={isMobile} onBack={() => navigate(-1)} scroll={scroll} />
      <TechImpactSection />

      <ClientGlobeSection />

      <TestimonialsSection />
      <CTASection />

      <Footer />
    </>
  );
}
