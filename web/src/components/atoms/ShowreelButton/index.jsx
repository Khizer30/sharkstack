import gsap from "gsap";
import { forwardRef, useEffect, useRef } from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

const BULLET_OFFSET = 60;
const TEXT_OFFSET = 50;
const ANIM_DURATION = 1.2;

const ShowreelButton = forwardRef(function ShowreelButton(
  {
    onClick,
    text = "Showreel",
    animateText = true,
    animateBullet = true,
    animateContainer = true,
    bgColor = colors.white,
    textColor = colors.black,
    bulletColor = colors.black,
    visible
  },
  ref
) {
  const bulletRef = useRef(null);
  const textRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!ref || typeof ref !== "object" || !ref.current) return;

    const container = ref.current;

    timelineRef.current?.kill();

    const animateIn = () => {
      gsap.set(container, { opacity: animateContainer ? 0 : 1, scale: animateContainer ? 0.8 : 1 });
      gsap.set(bulletRef.current, { opacity: animateBullet ? 0 : 1, x: animateBullet ? BULLET_OFFSET : 0, scale: animateBullet ? 0.3 : 1 });
      gsap.set(textRef.current, { opacity: animateText ? 0 : 1, x: animateText ? TEXT_OFFSET : 0, scale: animateText ? 0.8 : 1 });

      if (!(animateText || animateBullet || animateContainer)) return;

      const tl = gsap.timeline();

      if (animateText && textRef.current) {
        tl.to(textRef.current, { opacity: 1, x: 0, scale: 1, duration: ANIM_DURATION, ease: "back.out(3)" }, 0);
      }
      if (animateBullet && bulletRef.current) {
        tl.to(bulletRef.current, { opacity: 1, x: 0, scale: 1, duration: ANIM_DURATION, ease: "back.out(3)" }, animateText ? 0.1 : 0);
      }
      if (animateContainer) {
        tl.to(container, { opacity: 1, scale: 1, duration: ANIM_DURATION, ease: "back.out(3)" }, 0);
      }

      timelineRef.current = tl;
    };

    if (visible === undefined || visible) {
      animateIn();
    } else {
      gsap.set(container, { opacity: 0, scale: 0 });
      gsap.set(bulletRef.current, { opacity: 0, x: 0, scale: 0 });
      gsap.set(textRef.current, { opacity: 0, x: 0, scale: 0 });
    }

    return () => timelineRef.current?.kill();
  }, [ref, animateText, animateBullet, animateContainer, visible]);

  return (
    <div ref={ref} className="absolute z-[99999] pointer-events-none" style={{ left: 0, top: 0 }}>
      <button
        onClick={onClick}
        className="flex items-center gap-3 rounded-sm px-7 py-2.5 pointer-events-auto"
        style={{ backgroundColor: bgColor, color: textColor, whiteSpace: "nowrap" }}
      >
        <span ref={bulletRef} className="text-xs flex-shrink-0" style={{ color: bulletColor }}>
          ✦
        </span>
        <span ref={textRef} style={{ ...fonts.montMedium, whiteSpace: "nowrap" }}>
          {text}
        </span>
      </button>
    </div>
  );
});

export default ShowreelButton;
