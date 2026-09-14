import videoMp4 from "@/assets/animations/video.mp4";
import ScrollExpandMedia from "@/components/atoms/ScrollExpandMedia";
import { scrollExpandContent } from "@/content";

export default function ScrollExpandSection() {
  return <ScrollExpandMedia videoSrc={videoMp4} title={scrollExpandContent.title} subtitle={scrollExpandContent.subtitle} />;
}
