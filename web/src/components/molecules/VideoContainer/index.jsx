import { forwardRef } from "react";

const VideoContainer = forwardRef(function VideoContainer(
  { videoSrc, containerClassName = "", videoClassName = "", aspectRatio = "aspect-video", onHover, onLeave, height },
  ref
) {
  return (
    <div ref={ref} className={`w-full relative overflow-hidden ${containerClassName}`} onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className={`relative w-full ${height ? "" : aspectRatio}`} style={{ height }}>
        <video className={`h-full w-full object-cover ${videoClassName}`} src={videoSrc} autoPlay muted loop playsInline preload="auto" />
      </div>
    </div>
  );
});

export default VideoContainer;
