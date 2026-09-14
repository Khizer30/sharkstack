import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * @param {number} cents
 * @returns {string}
 */
function fmt(cents) {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/**
 * Maps a raw API package to PricingCard-compatible props.
 * @param {object} pkg
 * @param {number} index
 */
function mapPackage(pkg, index) {
  const isCustom = pkg.priceCents === null || pkg.priceCents === undefined;
  const price = isCustom ? "Custom" : fmt(pkg.priceCents);
  const period = isCustom ? null : "/ mo";

  return {
    id: pkg.id,
    name: pkg.title,
    tagline: pkg.description,
    price,
    period,
    delivery: null,
    revisions: null,
    features: pkg.features,
    highlight: pkg.slug === "ai-growth-suite",
    isCustomQuote: isCustom,
    index
  };
}

/**
 * Returns PricingCard-compatible props for each API package, or null while loading.
 * @returns {{ cards: object[] | null, status: string }}
 */
export function usePackagesAsCards() {
  const { items, status } = useSelector((s) => s.packages);

  const cards = useMemo(() => {
    if (!items.length) return null;
    return items.map((pkg, i) => mapPackage(pkg, i));
  }, [items]);

  return { cards, status };
}
