import { colors } from "@/constants/colors";

export default function ProjectVideo({ project, videoWrapRef, videoRef, isMobile }) {
  if (!project.video) return null;

  return (
    <div
      ref={videoWrapRef}
      style={{
        position: "fixed",
        ...(isMobile
          ? {
              left: "1rem",
              right: "1rem",
              top: "48vh",
              bottom: "1.5rem",
              borderRadius: "16px"
            }
          : {
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh"
            }),
        opacity: 0,
        zIndex: 16,
        background: colors.bgDark,
        transformOrigin: "center center",
        overflow: "hidden",
        willChange: "transform, opacity, border-radius",
        boxShadow: `0 32px 80px ${colors.black}60`
      }}
    >
      <video
        ref={videoRef}
        src={project.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)"
        }}
      />
    </div>
  );
}
