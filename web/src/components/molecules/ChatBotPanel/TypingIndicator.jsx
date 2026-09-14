import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { sharkAiContent } from "@/content";

const FRAMES = ["◐", "◓", "◑", "◒"];

export default function TypingIndicator() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 130);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...fonts.mono, fontSize: "0.83rem" }}
    >
      <span style={{ color: colors.primary }}>{FRAMES[frame]}</span>
      <span style={{ color: `${colors.white}60` }}>[{sharkAiContent.botName}] is thinking…</span>
    </motion.div>
  );
}
