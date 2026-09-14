import OutlinePill from "@/components/atoms/OutlinePill";
import { ctaContent } from "@/content";

export default function CTAContactLinks() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
      {ctaContent.contacts.map(({ label, href }) => (
        <OutlinePill key={href} href={href}>
          {label}
        </OutlinePill>
      ))}
    </div>
  );
}
