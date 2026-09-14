import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef } from "react";
import boteyeAnimation from "@/assets/lottie/boteye.lottie";

export default function LottieIcon() {
  const dotLottieRef = useRef(null);

  useEffect(() => {
    const handleVisibility = () => {
      const instance = dotLottieRef.current;
      if (!instance) return;
      if (document.hidden) instance.pause();
      else instance.play();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <DotLottieReact
      src={boteyeAnimation}
      loop
      autoplay
      dotLottieRefCallback={(instance) => {
        dotLottieRef.current = instance;
      }}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}
