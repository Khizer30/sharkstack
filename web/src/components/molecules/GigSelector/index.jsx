import GigTile from "@/components/atoms/GigTile";

export default function GigSelector({ gigs, selectedIds, onToggle }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{
        gap: "clamp(1rem, 2vw, 1.5rem)",
        width: "100%"
      }}
    >
      {gigs.map((gig) => (
        <GigTile key={gig.id} name={gig.name} tagline={gig.tagline} icon={gig.icon} active={selectedIds.includes(gig.id)} onClick={() => onToggle(gig.id)} />
      ))}
    </div>
  );
}
