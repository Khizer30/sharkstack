import { colors } from "@/constants/colors";

const SYMBOLS = [
  { text: "</>", top: "5%", duration: 9, delay: 0, size: "1.1rem", opacity: 0.18 },
  { text: "{ }", top: "15%", duration: 13, delay: 1.2, size: "0.95rem", opacity: 0.12 },
  { text: "npm install", top: "24%", duration: 8, delay: 0.4, size: "0.85rem", opacity: 0.14 },
  { text: "0x404", top: "33%", duration: 16, delay: 2.1, size: "1.2rem", opacity: 0.1 },
  { text: "undefined", top: "44%", duration: 7, delay: 0.7, size: "0.9rem", opacity: 0.13 },
  { text: "git push origin", top: "54%", duration: 11, delay: 1.8, size: "0.85rem", opacity: 0.12 },
  { text: "// page not found", top: "63%", duration: 10, delay: 0.2, size: "0.8rem", opacity: 0.16 },
  { text: "null", top: "73%", duration: 6, delay: 1.5, size: "1.1rem", opacity: 0.11 },
  { text: "Error: 404", top: "82%", duration: 12, delay: 0.9, size: "0.9rem", opacity: 0.14 },
  { text: "?.route", top: "91%", duration: 14, delay: 3.0, size: "0.85rem", opacity: 0.12 }
];

const KEYFRAMES = `
  @keyframes float-left {
    from { transform: translateX(110vw); }
    to   { transform: translateX(-30vw); }
  }
`;

export default function FloatingSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <style>{KEYFRAMES}</style>
      {SYMBOLS.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: s.size,
            color: colors.white,
            opacity: s.opacity,
            whiteSpace: "nowrap",
            animation: `float-left ${s.duration}s linear ${s.delay}s infinite`
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
