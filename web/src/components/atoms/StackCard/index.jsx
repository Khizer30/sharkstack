import { colors } from "@/constants/colors";

export default function StackCard({ image, zIndex }) {
  return (
    <div className="h-[60vh] w-full flex items-center justify-center sticky top-0 px-6" style={{ zIndex }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "26rem",
          height: "35rem",
          overflow: "hidden",
          boxShadow: `0 25px 50px -12px ${colors.black}80`
        }}
      >
        <img src={image.src} alt={image.alt} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}
