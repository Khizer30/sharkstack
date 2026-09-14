import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

export default function DesktopGallery({ images }) {
  const galleryRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const moveTo = gsap.quickTo(gallery, "x", { duration: 0.5, ease: "power2.out" });

    const handleMouseMove = (e) => {
      const ratio = (e.clientX / window.innerWidth) * 2 - 1;
      moveTo(ratio * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const featuredIndex = Math.floor(images.length / 2);
  const activeIndex = hoveredIndex ?? featuredIndex;

  return (
    <div ref={galleryRef} className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 items-center gap-2 md:gap-3 h-40 md:h-56 px-4 md:px-8 pb-0">
      {images.map((image, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={image.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`transition-[flex-grow] duration-500 ease-out flex items-center h-full ${isActive ? "flex-[2.4]" : "flex-1"}`}
          >
            <div className={`w-full transition-[height] duration-500 ease-out rounded-md overflow-hidden ${isActive ? "h-full" : "h-[70%]"}`}>
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
