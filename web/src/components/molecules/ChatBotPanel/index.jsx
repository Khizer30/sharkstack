import { motion, AnimatePresence, useDragControls } from "motion/react";
import { useEffect, useRef } from "react";
import BubbleField from "./BubbleField";
import ChatHeader from "./ChatHeader";
import ChatInputBar from "./ChatInputBar";
import LogLine from "./LogLine";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";
import { colors } from "@/constants/colors";

const mobileVariants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 }
};

export default function ChatBotPanel({
  isMobile,
  panelPos,
  dragConstraints,
  messages,
  animatedIds,
  onMessageAnimated,
  isTyping,
  quickReplies,
  showQuickReplies,
  onQuickReply,
  inputValue,
  onInputChange,
  onSend,
  onClear,
  onClose
}) {
  const scrollRef = useRef(null);
  const dragControls = useDragControls();
  const hasScrolledOnceRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: hasScrolledOnceRef.current ? "smooth" : "auto" });
    hasScrolledOnceRef.current = true;
  }, [messages, isTyping, showQuickReplies]);

  const openFrom = panelPos?.openFrom ?? "above";
  const clipOrigin = openFrom === "below" ? "100% 0%" : "100% 100%";
  const desktopVariants = {
    initial: { clipPath: `circle(0% at ${clipOrigin})`, opacity: 0, rotate: -2 },
    animate: { clipPath: `circle(150% at ${clipOrigin})`, opacity: 1, rotate: 0 },
    exit: { clipPath: `circle(0% at ${clipOrigin})`, opacity: 0, rotate: -2 }
  };

  return (
    <motion.div
      drag={isMobile ? "y" : true}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={isMobile ? { top: 0, bottom: 0 } : dragConstraints}
      dragElastic={isMobile ? { top: 0, bottom: 0.6 } : 0.06}
      dragMomentum={isMobile}
      onDragEnd={
        isMobile
          ? (_, info) => {
              if (info.offset.y > 110) onClose();
            }
          : undefined
      }
      variants={isMobile ? mobileVariants : desktopVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={isMobile ? { type: "spring", stiffness: 340, damping: 32 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={
        isMobile
          ? {
              position: "absolute",
              left: "clamp(0.65rem, 3.5vw, 1.1rem)",
              right: "clamp(0.65rem, 3.5vw, 1.1rem)",
              bottom: "calc(clamp(0.65rem, 3.5vw, 1.1rem) + env(safe-area-inset-bottom))",
              width: "auto",
              height: "min(30rem, 62dvh)",
              maxHeight: "62dvh",
              borderRadius: "1.25rem",
              overflow: "hidden",
              background: colors.black,
              border: `1px solid ${colors.primary}33`,
              boxShadow: `0 24px 50px rgba(0,0,0,0.55), 0 0 40px ${colors.primary}1F`,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              pointerEvents: "auto",
              zIndex: 9999
            }
          : {
              position: "absolute",
              top: panelPos?.top ?? 0,
              left: panelPos?.left ?? 0,
              width: panelPos?.width ?? "min(23rem, 88vw)",
              height: panelPos?.height ?? "min(38rem, 72vh)",
              borderRadius: "1.25rem",
              transformOrigin: openFrom === "below" ? "top right" : "bottom right",
              overflow: "hidden",
              background: colors.black,
              border: `1px solid ${colors.primary}33`,
              boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 60px ${colors.primary}22`,
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto",
              zIndex: 9999
            }
      }
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 35% at 100% 0%, ${colors.primary}18 0%, transparent 60%)`
        }}
      />
      <BubbleField />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        {isMobile && (
          <div
            onPointerDown={(e) => dragControls.start(e)}
            style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 0.65rem", flexShrink: 0, touchAction: "none", cursor: "grab" }}
          >
            <div style={{ width: 42, height: 5, borderRadius: "9999px", background: `${colors.white}35` }} />
          </div>
        )}

        <div onPointerDown={!isMobile ? (e) => dragControls.start(e) : undefined} style={!isMobile ? { cursor: "grab", touchAction: "none" } : undefined}>
          <ChatHeader onClose={onClose} />
        </div>

        <div
          ref={scrollRef}
          data-lenis-prevent
          className="chat-log-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem"
          }}
        >
          {messages.map((m) => (
            <LogLine key={m.id} from={m.from} text={m.text} skipTypewriter={animatedIds.has(m.id)} onAnimated={() => onMessageAnimated(m.id)} />
          ))}

          <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>

          <AnimatePresence>{showQuickReplies && <QuickReplies key="quick-replies" items={quickReplies} onSelect={onQuickReply} />}</AnimatePresence>
        </div>

        <ChatInputBar value={inputValue} onChange={onInputChange} onSend={onSend} onClear={onClear} disabled={isTyping} />
      </div>
    </motion.div>
  );
}
