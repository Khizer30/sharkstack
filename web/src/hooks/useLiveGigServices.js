import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useLiveGigServices(gigs) {
  const { items } = useSelector((s) => s.services);

  return useMemo(
    () =>
      gigs.map((gig) => {
        const match = items.find((s) => s.title === gig.name);
        if (!match) return gig;
        return { ...gig, name: match.title, tagline: match.description || gig.tagline };
      }),
    [gigs, items]
  );
}
