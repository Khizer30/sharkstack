import { motion, useScroll, useTransform } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/atoms/Spinner";
import { colors } from "@/constants/colors";
import { useIsMobile } from "@/hooks/useIsMobile";
import { fetchActivities } from "@/store/actions/activityActions";
import { normalizeActivity, isVideoActivity, shuffle } from "@/utils/activities";

const GALLERY_IMAGE_COUNT = 18;

const GalleryCtx = createContext(null);
const useGalleryCtx = () => useContext(GalleryCtx);

function splitColumns(images) {
  const cols = [[], [], []];
  images.forEach((img, i) => cols[i % 3].push(img));
  return cols;
}

function GalleryScroll({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  return (
    <GalleryCtx.Provider value={{ scrollYProgress }}>
      <div ref={ref} style={{ position: "relative", height: "500vh" }}>
        {children}
      </div>
    </GalleryCtx.Provider>
  );
}

function GallerySticky({ children }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: colors.white,
        perspective: "1200px",
        perspectiveOrigin: "center top"
      }}
    >
      {children}
    </div>
  );
}

function GalleryGrid({ children }) {
  const { scrollYProgress } = useGalleryCtx();
  const rotateX = useTransform(scrollYProgress, [0, 0.315], [42, 0]);
  const scale = useTransform(scrollYProgress, [0.315, 0.63], [1.15, 1]);
  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.5rem",
        padding: "0 1rem",
        rotateX,
        scale,
        transformStyle: "preserve-3d",
        transformOrigin: "50% 0%"
      }}
    >
      {children}
    </motion.div>
  );
}

function GalleryImage({ src: imgSrc, name }) {
  return (
    <div style={{ overflow: "hidden", flexShrink: 0 }}>
      <img
        src={imgSrc}
        alt={name}
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          aspectRatio: "4/3",
          objectFit: "cover",
          borderRadius: 0,
          boxShadow: `0 8px 32px ${colors.black}60`
        }}
      />
    </div>
  );
}

function GalleryCol({ images, yRange, style }) {
  const { scrollYProgress } = useGalleryCtx();
  const y = useTransform(scrollYProgress, [0.315, 0.7], yRange);
  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: "100%",
        y,
        ...style
      }}
    >
      {images.map(({ id, src, name }) => (
        <GalleryImage key={id} src={src} name={name} />
      ))}
    </motion.div>
  );
}

function MobileGallery({ images }) {
  return (
    <div
      style={{
        background: colors.white,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.5rem",
        padding: "3rem 1rem"
      }}
    >
      {images.map(({ id, src, name }, i) => (
        <motion.div
          key={id}
          style={{ overflow: "hidden" }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
        >
          <img
            src={src}
            alt={name}
            loading="lazy"
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              aspectRatio: "4/3",
              objectFit: "cover"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.activities);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (status === "idle") dispatch(fetchActivities());
  }, [status, dispatch]);

  const images = useMemo(() => shuffle(items.filter((a) => !isVideoActivity(a)).map(normalizeActivity)).slice(0, GALLERY_IMAGE_COUNT), [items]);
  const [col1, col2, col3] = useMemo(() => splitColumns(images), [images]);

  if (status === "loading" || status === "idle") {
    return (
      <div style={{ background: colors.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
        <Spinner size={20} />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div style={{ background: colors.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0", color: colors.textMuted }}>
        Photos are unavailable right now.
      </div>
    );
  }

  if (isMobile) return <MobileGallery images={images} />;

  return (
    <div style={{ background: colors.white }}>
      <GalleryScroll>
        <GallerySticky>
          <GalleryGrid>
            <GalleryCol images={col1} yRange={["0%", "-58%"]} />
            <GalleryCol images={col2} yRange={["-35%", "-70%"]} style={{ marginTop: "30%" }} />
            <GalleryCol images={col3} yRange={["0%", "-58%"]} />
          </GalleryGrid>
        </GallerySticky>
      </GalleryScroll>
    </div>
  );
}
