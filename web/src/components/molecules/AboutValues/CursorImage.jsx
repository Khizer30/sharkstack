import { colors } from "@/constants/colors";

export default function CursorImage({ active, cursor, opacity, scale }) {
  if (!active) return null;

  return (
    <img
      src={active.image}
      alt={active.title}
      style={{
        position: "fixed",
        left: cursor.x,
        top: cursor.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        width: 300,
        height: 400,
        objectFit: "cover",
        background: colors.black,
        borderRadius: "0.5rem",
        pointerEvents: "none",
        zIndex: 10,
        transition: "opacity 0.3s ease"
      }}
    />
  );
}
