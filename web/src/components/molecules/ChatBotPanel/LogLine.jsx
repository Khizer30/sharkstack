import { motion } from "motion/react";
import { useEffect, useState } from "react";
import ChatMarkdown from "./ChatMarkdown";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { sharkAiContent } from "@/content";

function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{ display: "inline-block", width: "0.5em", height: "1em", background: colors.primary, marginLeft: 2, verticalAlign: "text-bottom" }}
    />
  );
}

export default function LogLine({ from, text, skipTypewriter, onAnimated }) {
  const isBot = from === "bot";
  const [shown, setShown] = useState(isBot && !skipTypewriter ? "" : text);

  useEffect(() => {
    if (!isBot || skipTypewriter) return;
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 34));
    const id = setInterval(() => {
      i += step;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onAnimated?.();
      }
    }, 14);
    return () => clearInterval(id);
  }, [text, isBot, skipTypewriter]);

  const done = shown.length >= text.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.55rem",
        ...fonts.mono,
        fontSize: "0.83rem",
        lineHeight: 1.6
      }}
    >
      {isBot ? (
        <>
          <span
            style={{
              flexShrink: 0,
              background: colors.primary,
              color: colors.white,
              fontWeight: 700,
              padding: "0 0.4rem",
              borderRadius: "0.25rem"
            }}
          >
            [{sharkAiContent.botName}]
          </span>
          <div style={{ color: `${colors.white}CC`, wordBreak: "break-word" }}>
            <ChatMarkdown text={shown} cursor={!done && <BlinkCursor />} />
          </div>
        </>
      ) : (
        <>
          <span style={{ color: colors.termDim, flexShrink: 0 }}>$</span>
          <span style={{ color: colors.white, wordBreak: "break-word" }}>{text}</span>
        </>
      )}
    </motion.div>
  );
}
