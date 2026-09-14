import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import SectionLabel from "@/components/atoms/SectionLabel";
import ChatOptionsModal from "@/components/molecules/ChatOptionsModal";
import ContactDrawer from "@/components/molecules/Footer/ContactDrawer";
import PricingCard from "@/components/molecules/PricingCard";
import { colors } from "@/constants/colors";
import { textVariants } from "@/constants/typography";
import { pricingContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { usePackagesAsCards } from "@/hooks/usePackagesAsCards";
import { fetchPackages } from "@/store/actions/packageActions";
import { navigateToSection } from "@/utils/helpers";

export default function PricingSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { transitionTo, transitionToSection } = usePageTransition();

  const [chatContext, setChatContext] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const { cards: packageCards, status: packagesStatus } = usePackagesAsCards();

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleChatAboutIt = (packageName) => setChatContext({ packageName });

  const handleChatDirectly = () => setMessageOpen(true);

  const handleOpenChatbot = (packageName) => {
    const prePrompt = packageName ? `I'm interested in the ${packageName} package. Can you tell me more and help me get started?` : undefined;
    if (window.__openChatbot) {
      window.__openChatbot({ prePrompt });
    } else {
      window.dispatchEvent(new CustomEvent("open-chatbot", { detail: { prePrompt } }));
    }
  };

  const handleBookCall = () => {
    setChatContext(null);
    navigateToSection("#book-call", navigate, pathname, transitionTo, transitionToSection);
  };

  const handleSendMessage = () => {
    setChatContext(null);
    setMessageOpen(true);
  };

  return (
    <section
      className="relative w-full"
      style={{
        background: colors.bgPrimary,
        padding: "clamp(8rem, 12vw, 10rem) clamp(1.5rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)"
      }}
    >
      <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SectionLabel label={pricingContent.label} />
        </div>

        <h1 style={{ ...textVariants.h1, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginTop: "1.5rem" }}>{pricingContent.heading}</h1>

        <p style={{ ...textVariants.body, color: colors.textSecondary, marginTop: "1.25rem" }}>{pricingContent.subheading}</p>
      </div>

      <AnimatePresence mode="wait">
        {packagesStatus === "loading" && (
          <motion.div
            key="pkg-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "clamp(1.25rem, 2.5vw, 2rem)",
              maxWidth: "68rem",
              margin: "clamp(3rem, 5vw, 4rem) auto 0"
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: "20rem",
                  borderRadius: "1.5rem",
                  background: colors.borderLight,
                  opacity: 0.5
                }}
              />
            ))}
          </motion.div>
        )}

        {packageCards && (
          <motion.div
            key="pkg-cards"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "clamp(1.25rem, 2.5vw, 2rem)",
              maxWidth: "68rem",
              margin: "clamp(3rem, 5vw, 4rem) auto 0"
            }}
          >
            {packageCards.map((card) => (
              <PricingCard
                key={card.id}
                {...card}
                onGetStarted={card.isCustomQuote ? handleOpenChatbot : handleChatAboutIt}
                onChatAboutIt={handleChatDirectly}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ChatOptionsModal
        open={!!chatContext}
        packageName={chatContext?.packageName}
        onClose={() => setChatContext(null)}
        onBookCall={handleBookCall}
        onSendMessage={handleSendMessage}
      />

      <ContactDrawer open={messageOpen} onClose={() => setMessageOpen(false)} />
    </section>
  );
}

