import { colors } from "@/constants/colors";

export default function StarRating({ rating = 5, max = 5, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? colors.primary : "none"}
          stroke={i < rating ? colors.primary : colors.borderMedium}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
