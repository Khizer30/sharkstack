import gsap from "gsap";
import { forwardRef, useRef, useEffect, useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShowreelButton from "@/components/atoms/ShowreelButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { navigateToSection } from "@/utils/helpers";

const useMouseFollowInsideContainer = (elementRef, containerRef, isActive) => {
  const handleMouseMove = useCallback(
    (e) => {
      if (!elementRef.current || !containerRef.current || !isActive) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      let x = e.clientX - containerRect.left - elementRect.width / 2;
      let y = e.clientY - containerRect.top - elementRect.height / 2;

      const maxX = containerRect.width - elementRect.width;
      const maxY = containerRect.height - elementRect.height;
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      gsap.to(elementRef.current, { x, y, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    },
    [elementRef, containerRef, isActive]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef, handleMouseMove]);
};

const ContactUsBox = forwardRef(function ContactUsBox({ onHover, onLeave, onNavigate }, ref) {
  const containerRef = useRef(null);
  const showreelButtonRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isHovered, setIsHovered] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateContainerDimensions();
    window.addEventListener("resize", updateContainerDimensions);
    return () => window.removeEventListener("resize", updateContainerDimensions);
  }, []);

  useMouseFollowInsideContainer(showreelButtonRef, containerRef, isHovered);

  const centerShowreelButton = useCallback(() => {
    if (!showreelButtonRef.current || containerDimensions.width === 0) return;

    const button = showreelButtonRef.current;
    const buttonRect = button.getBoundingClientRect();

    gsap.set(button, {
      x: (containerDimensions.width - buttonRect.width) / 2,
      y: (containerDimensions.height - buttonRect.height) / 2
    });
  }, [containerDimensions]);

  useEffect(() => {
    if (showreelButtonRef.current) centerShowreelButton();
  }, [isHovered, centerShowreelButton]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: isHovered ? colors.primary : colors.bgBrand,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave?.();
  };
  const handleShowreelClick = () => {
    if (onNavigate) onNavigate();
    else navigateToSection("#cta", navigate, pathname);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden transition-all duration-500"
      style={{ height: "150px" }}
    >
      <div ref={containerRef} className="absolute inset-0" style={{ backgroundColor: colors.bgBrand }}>
        {!isHovered && (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2" style={{ ...fonts.montMedium, color: colors.white }}>
              <span>Contact Us</span>
              <span style={{ color: colors.primary, fontSize: "0.65rem" }}>✦</span>
            </div>
          </div>
        )}

        {isHovered && (
          <ShowreelButton
            ref={showreelButtonRef}
            onClick={handleShowreelClick}
            text="Contact Us"
            bgColor={colors.black}
            textColor={colors.white}
            bulletColor={colors.primary}
            animateText
            animateBullet
            animateContainer
          />
        )}
      </div>
    </div>
  );
});

export default ContactUsBox;
