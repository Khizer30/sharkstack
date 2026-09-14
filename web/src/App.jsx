import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomCursor from "@/components/atoms/CustomCursor";
import ChatBotWidget from "@/components/organisms/ChatBotWidget";
import { PageTransitionProvider } from "@/context/PageTransition";
import AppRoutes from "@/routes/AppRoutes";
import { fetchServices } from "@/store/actions/serviceActions";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const dispatch = useDispatch();
  const servicesStatus = useSelector((s) => s.services.status);

  useEffect(() => {
    if (servicesStatus === "idle") dispatch(fetchServices());
  }, [servicesStatus, dispatch]);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.8,
      syncTouch: true,
      infinite: false
    });

    window["__lenis"] = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      window["__lenis"] = null;
    };
  }, []);

  return (
    <PageTransitionProvider>
      <CustomCursor />
      <AppRoutes />
      <ChatBotWidget />
    </PageTransitionProvider>
  );
}

export default App;
