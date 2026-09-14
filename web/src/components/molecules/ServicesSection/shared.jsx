import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fonts } from "@/constants/typography";

export const headingStyle = {
  ...fonts.poppinsBold,
  fontSize: "clamp(3.5rem, 11vw, 13rem)",
  lineHeight: 0.88,
  letterSpacing: "-0.03em",
  textTransform: "uppercase"
};

export const labelStyle = {
  ...fonts.montSemiBold,
  fontSize: "clamp(2rem, 4vw, 4.5rem)",
  letterSpacing: "0.15em",
  textTransform: "uppercase"
};

export const bodyStyle = {
  ...fonts.montRegular,
  fontSize: "clamp(1rem, 2vw, 1.5rem)",
  lineHeight: 1.65
};

export const colLabelStyle = {
  ...fonts.montSemiBold,
  fontSize: "0.7rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  marginBottom: "0.5rem"
};

export const colBodyStyle = {
  ...fonts.montRegular,
  fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
  lineHeight: 1.7
};

export function Hr({ color = "rgba(255,255,255,0.15)" }) {
  return <hr style={{ border: "none", borderTop: `1px solid ${color}`, margin: "2vw 0" }} />;
}

export function useServiceContent(title) {
  const { items, status } = useSelector((s) => s.services);

  const service = useMemo(() => items.find((s) => s.title === title), [items, title]);

  return useMemo(() => {
    if (!service) return { status, body: null, cols: [] };

    const subheadings = service.subheadings ?? [];
    const mid = Math.ceil(subheadings.length / 2);
    const cols = [subheadings.slice(0, mid), subheadings.slice(mid)]
      .filter((group) => group.length > 0)
      .map((group) => group.map((s) => ({ label: s.title, body: s.description })));

    return { status, body: service.description, cols };
  }, [service, status]);
}

export function Cols({ items, textColor }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "3vw" }}>
      {items.map(({ label, body }) => (
        <div key={label} style={{ minWidth: 180, flex: 1 }}>
          <p style={{ ...colLabelStyle, color: textColor }}>{label}</p>
          <p style={{ ...colBodyStyle, color: textColor }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

function SkeletonBar({ width, height, color }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "0.25rem",
        background: color,
        animation: "service-skeleton-pulse 1.4s ease-in-out infinite"
      }}
    />
  );
}

export function ServiceContentBody({ status, body, cols, textColor, hrColor }) {
  const isReady = status === "succeeded" && !!body && cols.length > 0;
  const barColor = `${textColor}1F`;

  if (!isReady) {
    return (
      <>
        <style>{`@keyframes service-skeleton-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "50ch" }}>
          <SkeletonBar width="100%" height="1.1em" color={barColor} />
          <SkeletonBar width="88%" height="1.1em" color={barColor} />
          <SkeletonBar width="55%" height="1.1em" color={barColor} />
        </div>
        <div>
          <Hr color={hrColor} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3vw" }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ minWidth: 180, flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <SkeletonBar width="55%" height="0.7rem" color={barColor} />
                <SkeletonBar width="92%" height="0.85rem" color={barColor} />
                <SkeletonBar width="70%" height="0.85rem" color={barColor} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <p style={{ ...bodyStyle, color: textColor, maxWidth: "50ch" }}>{body}</p>
      {cols.map((group, i) => (
        <div key={i}>
          <Hr color={hrColor} />
          <Cols textColor={textColor} items={group} />
        </div>
      ))}
    </>
  );
}
