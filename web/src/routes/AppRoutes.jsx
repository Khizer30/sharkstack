import { lazy, Suspense, useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Careers = lazy(() => import("@/pages/Careers"));
const JobDetail = lazy(() => import("@/pages/JobDetail"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Training = lazy(() => import("@/pages/Training"));
const TrainingForm = lazy(() => import("@/pages/TrainingForm"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Refunds = lazy(() => import("@/pages/Refunds"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const lenis = window["__lenis"];
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, [pathname]);
  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:roleId" element={<JobDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/ai-training" element={<Training />} />
            <Route path="/ai-training/form" element={<TrainingForm />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refunds" element={<Refunds />} />
          </Route>
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
