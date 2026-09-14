import { colors } from "@/constants/colors";

export default function AmbientGlow() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `
        radial-gradient(ellipse 70% 40% at 50% 100%, ${colors.primary}08 0%, transparent 60%),
        radial-gradient(ellipse 40% 30% at 90% 0%, ${colors.primary}05 0%, transparent 50%)
      `
      }}
    />
  );
}
