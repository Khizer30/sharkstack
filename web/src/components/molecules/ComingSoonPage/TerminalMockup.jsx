import { colors } from "@/constants/colors";
import { sizes } from "@/constants/typography";

const TERMINAL_LINES = [
  { prefix: "$", text: "npm create sharkstack@latest", color: colors.white },
  { prefix: "◆", text: "Template  › Full Stack", color: colors.termMuted },
  { prefix: "✓", text: "Scaffolding project", color: colors.termSuccess },
  { prefix: "✓", text: "Installing dependencies", color: colors.termSuccess },
  { prefix: "✓", text: "Design system configured", color: colors.termSuccess },
  { prefix: "✓", text: "Routes + layouts wired", color: colors.termSuccess },
  { prefix: "✓", text: "Auth context ready", color: colors.termSuccess },
  { prefix: "◐", text: "Launching v1.0...", color: colors.primary }
];

export default function TerminalMockup({ terminalRef }) {
  return (
    <div
      className="terminal-wrap order-1 lg:order-1 relative w-full h-[340px] lg:h-[520px] flex items-center justify-center z-10"
      style={{ perspective: "1000px" }}
    >
      <div className="relative w-full h-full flex items-center justify-center scale-[0.82] md:scale-95 lg:scale-100">
        <div ref={terminalRef} className="term-window relative w-[380px] rounded-2xl overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
          <div className="term-chrome flex items-center gap-2 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: colors.macRed }} />
              <div className="w-3 h-3 rounded-full" style={{ background: colors.macYellow }} />
              <div className="w-3 h-3 rounded-full" style={{ background: colors.macGreen }} />
            </div>
            <span className="flex-1 text-center font-mono" style={{ fontSize: sizes.xs, color: colors.termMuted }}>
              sharkstack — zsh
            </span>
          </div>

          <div className="px-5 py-4 font-mono space-y-1.5" style={{ fontSize: "12px", lineHeight: 1.6, background: colors.bgDark }}>
            {TERMINAL_LINES.map((line, i) => (
              <div key={i} className="term-line flex items-start gap-2 gsap-reveal">
                <span style={{ color: line.prefix === "$" ? colors.termDim : line.color }}>{line.prefix}</span>
                <span style={{ color: line.color }}>{line.text}</span>
                {i === TERMINAL_LINES.length - 1 && <span className="term-cursor" />}
              </div>
            ))}

            <div className="term-line gsap-reveal pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ color: colors.termDim }}>Build progress</span>
                <span style={{ color: colors.primary, fontWeight: 700 }}>87%</span>
              </div>
              <div className="term-progress-track w-full h-1.5 rounded-full overflow-hidden">
                <div className="prog-fill-el term-progress-fill h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
