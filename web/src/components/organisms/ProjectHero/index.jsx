import AmbientGlow from "@/components/atoms/AmbientGlow";
import ScrollProgressBar from "@/components/atoms/ScrollProgressBar";
import ProjectBackButton from "@/components/molecules/ProjectDetail/ProjectBackButton";
import ProjectHeroMedia from "@/components/molecules/ProjectDetail/ProjectHeroMedia";
import ProjectHeroText from "@/components/molecules/ProjectDetail/ProjectHeroText";
import ProjectImageMosaic from "@/components/molecules/ProjectDetail/ProjectImageMosaic";
import ProjectTitle from "@/components/molecules/ProjectDetail/ProjectTitle";
import ProjectVideo from "@/components/molecules/ProjectDetail/ProjectVideo";
import BuiltWithPanel from "@/components/organisms/BuiltWithPanel";
import CapabilitiesPanel from "@/components/organisms/CapabilitiesPanel";
import MobileProjectDrawer from "@/components/organisms/MobileProjectDrawer";
import ProblemSolutionPanel from "@/components/organisms/ProblemSolutionPanel";
import { colors } from "@/constants/colors";

export default function ProjectHero({ project, isMobile, onBack, scroll }) {
  const {
    containerRef,
    wrapRef,
    nameRef,
    descRef,
    blockRefs,
    imageWrapRef,
    videoWrapRef,
    videoRef,
    detailRef,
    techRef,
    mobileDrawerRef,
    toolsRef,
    progressBarHeight,
    nameScale,
    heroTextY,
    heroTextOpacity,
    heroTextScale,
    heroTextFilter,
    mobileTextY,
    heroImageOpacity,
    blocks,
    mobileBlocks
  } = scroll;

  return (
    <>
      <ScrollProgressBar progress={progressBarHeight} />

      <div ref={containerRef} style={{ height: "1700vh", position: "relative", width: "100%" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#f5f3f0",
            color: colors.textPrimary
          }}
        >
          <AmbientGlow />
          <ProjectBackButton isMobile={isMobile} onClick={onBack} />
          <ProjectTitle project={project} isMobile={isMobile} wrapRef={wrapRef} nameRef={nameRef} nameScale={nameScale} />
          <ProjectHeroText
            project={project}
            isMobile={isMobile}
            descRef={descRef}
            mobileTextY={mobileTextY}
            heroTextY={heroTextY}
            heroTextOpacity={heroTextOpacity}
            heroTextScale={heroTextScale}
            heroTextFilter={heroTextFilter}
          />
          <ProjectHeroMedia project={project} isMobile={isMobile} heroImageOpacity={heroImageOpacity} />
          <ProjectImageMosaic
            project={project}
            blocks={blocks}
            mobileBlocks={mobileBlocks}
            blockRefs={blockRefs}
            imageWrapRef={imageWrapRef}
            isMobile={isMobile}
          />
          <ProjectVideo project={project} videoWrapRef={videoWrapRef} videoRef={videoRef} isMobile={isMobile} />

          {!isMobile && <ProblemSolutionPanel ref={detailRef} project={project} />}
          {!isMobile && <CapabilitiesPanel ref={techRef} project={project} />}
          <BuiltWithPanel ref={toolsRef} project={project} isMobile={isMobile} />
          {isMobile && <MobileProjectDrawer ref={mobileDrawerRef} project={project} />}
        </div>
      </div>
    </>
  );
}
