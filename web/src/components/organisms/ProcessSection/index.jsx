import CyclingWords from "@/components/molecules/ProcessSection/CyclingWords";
import ProcessPanel from "@/components/molecules/ProcessSection/ProcessPanel";
import { makeProcessStyles } from "@/components/molecules/ProcessSection/styles";
import { processContent } from "@/content";

export default function ProcessSection() {
  return (
    <div className="ps-root">
      <style dangerouslySetInnerHTML={{ __html: makeProcessStyles(processContent.words.length) }} />
      <CyclingWords />
      <ProcessPanel />
    </div>
  );
}
