import { motion, useTransform } from "motion/react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const letterStyle = {
  ...fonts.poppinsBold,
  fontSize: "clamp(3.5rem, 17vw, 15rem)",
  lineHeight: 1,
  letterSpacing: "-0.03em",
  textTransform: "uppercase",
  color: colors.cream
};

export default function StairLetter({ ch, index, totalLetters, stair, scrollYProgress }) {
  const start = (index / totalLetters) * 0.45;
  const end = start + 0.15;
  const y = useTransform(scrollYProgress, [start, end], ["60vh", "0vh"]);

  return (
    <span className="inline-block" style={{ transform: `translateY(${stair}em)` }}>
      <motion.span className="inline-block" style={{ ...letterStyle, y }}>
        {ch}
      </motion.span>
    </span>
  );
}
