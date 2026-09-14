import CircleAnimation from "@/components/molecules/NotFoundPage/CircleAnimation";
import MessageDisplay from "@/components/molecules/NotFoundPage/MessageDisplay";
import { colors } from "@/constants/colors";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: colors.bgBrand }}>
      <CircleAnimation />
      <MessageDisplay />
    </div>
  );
}
