import { useState, useRef, useEffect } from "react";
import AboutTeamHeading from "@/components/molecules/AboutTeam/AboutTeamHeading";
import RoleLabel from "@/components/molecules/AboutTeam/RoleLabel";
import SocialLinks from "@/components/molecules/AboutTeam/SocialLinks";
import TeamMemberRow from "@/components/molecules/AboutTeam/TeamMemberRow";
import { aboutTeamContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AboutTeam() {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRefs = useRef([]);
  const members = aboutTeamContent.members;

  useEffect(() => {
    const MIN_DWELL = 450;
    let rafId = null;
    let dwellTimeout = null;
    let lastChangeTime = performance.now();

    const computeClosest = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDist = Infinity;

      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const dist = Math.abs(rowCenter - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      return closestIndex;
    };

    const tryUpdate = () => {
      rafId = null;
      const closest = computeClosest();

      setActiveIndex((current) => {
        if (closest === current) return current;

        const now = performance.now();
        const elapsed = now - lastChangeTime;

        if (elapsed >= MIN_DWELL) {
          lastChangeTime = now;
          return closest;
        }

        if (!dwellTimeout) {
          dwellTimeout = setTimeout(() => {
            dwellTimeout = null;
            tryUpdate();
          }, MIN_DWELL - elapsed);
        }

        return current;
      });
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(tryUpdate);
    };

    tryUpdate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (dwellTimeout) clearTimeout(dwellTimeout);
    };
  }, []);

  const active = members[activeIndex] ?? members[0];

  return (
    <section
      className="relative w-full"
      style={{ background: "transparent", padding: "clamp(6rem, 10vw, 8rem) clamp(2rem, 6vw, 7rem) clamp(2rem, 6vw, 4rem)" }}
    >
      <AboutTeamHeading />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2.4fr_1fr] md:gap-6">
        <RoleLabel role={active.role} />

        <div className="w-full">
          {members.map((member, i) => (
            <TeamMemberRow
              key={member.name}
              member={member}
              index={i}
              isActive={i === activeIndex}
              isMobile={isMobile}
              rowRef={(el) => {
                rowRefs.current[i] = el;
              }}
            />
          ))}
          <div aria-hidden style={{ height: isMobile ? "25vh" : "40vh" }} />
        </div>

        <SocialLinks socials={active.socials} activeKey={active.name} />
      </div>
    </section>
  );
}
