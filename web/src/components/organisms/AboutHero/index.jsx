import { lazy, Suspense, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DriftingHeading from "@/components/atoms/DriftingHeading";
import DesktopGallery from "@/components/molecules/AboutHero/DesktopGallery";
import MobileCardStack from "@/components/molecules/AboutHero/MobileCardStack";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { aboutHeroContent } from "@/content";
import { fetchActivities } from "@/store/actions/activityActions";
import { normalizeActivityAsGalleryImage, isVideoActivity, shuffle } from "@/utils/activities";

const InteractiveNebulaShader = lazy(() => import("@/components/atoms/InteractiveNebulaShader"));

const GALLERY_IMAGE_COUNT = 5;

export default function AboutHero() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.activities);

  useEffect(() => {
    if (status === "idle") dispatch(fetchActivities());
  }, [status, dispatch]);

  const gallery = useMemo(() => shuffle(items.filter((a) => !isVideoActivity(a)).map(normalizeActivityAsGalleryImage)).slice(0, GALLERY_IMAGE_COUNT), [items]);

  return (
    <section className="relative w-full">
      <div className="relative h-screen overflow-hidden">
        <Suspense fallback={<div className="fixed inset-0 z-0" style={{ background: colors.bgBrand }} />}>
          <InteractiveNebulaShader fixed className="z-0" />
        </Suspense>

        <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-16 pt-24 md:pt-0 pb-0 md:pb-24">
          <DriftingHeading
            className="text-center text-4xl md:text-5xl lg:text-6xl leading-tight max-w-6xl whitespace-normal lg:whitespace-nowrap"
            style={{ ...fonts.poppinsMedium, color: colors.white }}
          >
            {aboutHeroContent.heading.line1}
            <br />
            {aboutHeroContent.heading.line2}
          </DriftingHeading>
        </div>

        <DesktopGallery images={gallery} />
      </div>

      <MobileCardStack images={gallery} />
    </section>
  );
}
