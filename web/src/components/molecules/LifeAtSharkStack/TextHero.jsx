import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ParallaxBanner from "@/components/organisms/ParallaxBanner";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { lifeAtSharkStackContent } from "@/content";
import { fetchActivities } from "@/store/actions/activityActions";
import { normalizeActivityAsHeroImage, isVideoActivity, shuffle } from "@/utils/activities";

const HERO_IMAGE_COUNT = 4;

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } }
};

const word = {
  hidden: { opacity: 0, y: 80, scale: 0.94, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE }
  }
};

export default function TextHero() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.activities);
  const { line1, accent } = lifeAtSharkStackContent.heading;

  useEffect(() => {
    if (status === "idle") dispatch(fetchActivities());
  }, [status, dispatch]);

  const heroImages = useMemo(() => shuffle(items.filter((a) => !isVideoActivity(a)).map(normalizeActivityAsHeroImage)).slice(0, HERO_IMAGE_COUNT), [items]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <section style={{ background: colors.black, padding: "clamp(6rem, 9vw, 8rem) 0 0" }}>
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", padding: "0 1.5rem" }}>
        <motion.h2
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          style={{
            ...fonts.poppinsBold,
            fontSize: "clamp(2.5rem, 9vw, 13rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
            color: colors.white,
            margin: 0
          }}
        >
          <motion.span variants={word} style={{ display: "inline-block" }}>
            {line1}
          </motion.span>{" "}
          <motion.span variants={word} style={{ display: "inline-block" }}>
            {accent}
          </motion.span>
        </motion.h2>
      </div>

      {isLoading
        ? Array.from({ length: HERO_IMAGE_COUNT }, (_, i) => (
            <div key={i} className="mx-2 my-10 overflow-hidden">
              <div
                className="h-[80vh]"
                style={{
                  background: `${colors.white}0D`,
                  animation: "hero-skeleton-pulse 1.4s ease-in-out infinite"
                }}
              />
            </div>
          ))
        : heroImages.map((image) => (
            <div key={image.id}>
              <ParallaxBanner content={image} showOverlay={false} rounded={false} />
            </div>
          ))}
      <style>{`@keyframes hero-skeleton-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
    </section>
  );
}
