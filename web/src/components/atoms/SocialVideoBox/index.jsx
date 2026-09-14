import { forwardRef, useRef } from "react";
import VideoContainer from "@/components/molecules/VideoContainer";
import { useShowreelVideo } from "@/hooks/useShowreelVideo";

const SocialVideoBox = forwardRef(function SocialVideoBox({ onHover, onLeave }, ref) {
  const videoSrc = useShowreelVideo();
  const containerRef = useRef(null);

  const setRefs = (element) => {
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
    containerRef.current = element;
  };

  return (
    <div ref={setRefs} style={{ height: "150px" }} className="relative">
      <VideoContainer
        videoSrc={videoSrc}
        containerClassName="overflow-hidden transition-all duration-500 w-full h-full"
        videoClassName="w-full h-full object-cover"
        aspectRatio=""
        onHover={onHover}
        onLeave={onLeave}
        height="100%"
      />

      <div className="absolute inset-0 bg-black/40 lg:hidden pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent w-1/3 ml-auto lg:hidden pointer-events-none" />
    </div>
  );
});

export default SocialVideoBox;
