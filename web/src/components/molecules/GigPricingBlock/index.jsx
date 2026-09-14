import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LaptopIcon, LatticeIcon, OrbitRingsIcon, SparkleIcon, ChevronDownIcon } from "@/assets/svgs";
import PricingModeToggle from "@/components/atoms/PricingModeToggle";
import CustomPackageBuilder from "@/components/molecules/CustomPackageBuilder";
import PackageComparisonTable from "@/components/molecules/PackageComparisonTable";
import PricingCard from "@/components/molecules/PricingCard";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";

const ICONS = {
  laptop: LaptopIcon,
  lattice: LatticeIcon,
  orbit: OrbitRingsIcon,
  sparkle: SparkleIcon
};

const MODES = [
  { value: "packages", label: "Packages" },
  { value: "custom", label: "Build your own" }
];

export default function GigPricingBlock({ gig, mode, onModeChange, ctaLabel, disclaimer, onChatAboutIt }) {
  const Icon = ICONS[gig.icon] ?? SparkleIcon;
  const [view, setView] = useState("cards");
  const [prevMode, setPrevMode] = useState(mode);
  const [selectedPackage, setSelectedPackage] = useState(() => gig.packages.find((p) => p.highlight)?.name ?? gig.packages[0]?.name);

  if (mode !== prevMode) {
    setPrevMode(mode);
    setView("cards");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3rem",
              height: "3rem",
              borderRadius: "1rem",
              background: `${colors.primary}12`,
              color: colors.primary,
              flexShrink: 0
            }}
          >
            <Icon size={22} />
          </span>
          <div>
            <h2 style={{ ...fonts.poppinsBold, fontSize: "clamp(1.15rem, 2vw, 1.4rem)", color: colors.textPrimary }}>{gig.name}</h2>
            <p style={{ ...textVariants.bodySm, color: colors.textMuted, marginTop: "0.15rem" }}>{gig.tagline}</p>
          </div>
        </div>

        <PricingModeToggle options={MODES} value={mode} onChange={onModeChange} />
      </div>

      <div style={{ marginTop: "clamp(2rem, 4vw, 2.75rem)" }}>
        <AnimatePresence mode="wait">
          {mode === "packages" ? (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
                <button
                  type="button"
                  onClick={() => setView((v) => (v === "cards" ? "compare" : "cards"))}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    ...fonts.montSemiBold,
                    fontSize: "0.8rem",
                    color: colors.primary,
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {view === "cards" ? "Compare packages" : "View packages"}
                  <motion.span animate={{ rotate: view === "compare" ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}>
                    <ChevronDownIcon size={14} />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {view === "cards" ? (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "clamp(1.25rem, 2.5vw, 2rem)"
                    }}
                  >
                    {gig.packages.map((pkg, i) => (
                      <PricingCard
                        key={pkg.name}
                        {...pkg}
                        index={i}
                        selected={pkg.name === selectedPackage}
                        onSelect={setSelectedPackage}
                        onChatAboutIt={onChatAboutIt}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PackageComparisonTable
                      packages={gig.packages}
                      compareRows={gig.compareRows}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CustomPackageBuilder
                gigName={gig.name}
                basePrice={gig.basePrice}
                categories={gig.customCategories}
                ctaLabel={ctaLabel}
                disclaimer={disclaimer}
                onChatAboutIt={onChatAboutIt}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
