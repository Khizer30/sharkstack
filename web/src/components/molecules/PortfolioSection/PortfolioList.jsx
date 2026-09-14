import PortfolioRow from "./PortfolioRow";
import { colors } from "@/constants/colors";

export default function PortfolioList({ projects, activeId, setActiveId, isMobile }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        backgroundColor: colors.bgBrand,
        borderRadius: "1.5rem 1.5rem 0 0",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(2rem, 4vw, 3rem)",
        paddingLeft: "clamp(1.5rem, 6vw, 7rem)",
        paddingRight: "clamp(1.5rem, 6vw, 7rem)",
        borderTop: `1px solid ${colors.white}12`
      }}
    >
      {projects.map((project, index) => (
        <PortfolioRow
          key={project.id}
          data={project}
          index={index}
          isActive={activeId === project.id}
          setActiveId={setActiveId}
          isMobile={isMobile}
          isAnyActive={activeId !== null}
        />
      ))}
    </div>
  );
}
