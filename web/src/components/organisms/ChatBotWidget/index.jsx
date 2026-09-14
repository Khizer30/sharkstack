import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import ChatOrbLauncher from "@/components/atoms/ChatOrbLauncher";
import ChatBotPanel from "@/components/molecules/ChatBotPanel";
import { sharkAiContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { sendMessageToSharkAI } from "@/store/actions/sharkAiActions";
import { resetSharkAiSession } from "@/store/slices/sharkAiSlice";

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

const PANEL_W = 368; // matches ChatBotPanel's min(23rem, 88vw) at desktop widths
const PANEL_H = 608; // matches ChatBotPanel's min(38rem, 72vh) at desktop heights
const EDGE_MARGIN = 16;

export default function ChatBotWidget() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const arenaRef = useRef(null);
  const portalArenaRef = useRef(null);
  const launcherRef = useRef(null);
  const draggedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [panelPos, setPanelPos] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [apiQuickReplies, setApiQuickReplies] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [pendingPrePrompt, setPendingPrePrompt] = useState(null);
  const pendingPrePromptRef = useRef(null);
  const fallbackIndexRef = useRef(0);
  const animatedIdsRef = useRef(new Set());
  const markAnimated = (id) => animatedIdsRef.current.add(id);

  useEffect(() => {
    window.__openChatbot = (opts = {}) => {
      if (opts.prePrompt) {
        pendingPrePromptRef.current = opts.prePrompt;
        setPendingPrePrompt(opts.prePrompt);
      }
      setIsOpen(true);
      setHasUnread(false);
    };
    return () => {
      window.__openChatbot = null;
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.prePrompt) {
        pendingPrePromptRef.current = e.detail.prePrompt;
        setPendingPrePrompt(e.detail.prePrompt);
      }
      setIsOpen(true);
    };
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || isMobile) return;

    const computePosition = () => {
      const rect = launcherRef.current?.getBoundingClientRect();
      if (!rect) return;

      const panelW = Math.min(PANEL_W, window.innerWidth * 0.88);
      const panelH = Math.min(PANEL_H, window.innerHeight * 0.72);

      const openAbove = rect.top - panelH - EDGE_MARGIN >= EDGE_MARGIN;
      const top = openAbove ? rect.top - panelH - EDGE_MARGIN : Math.min(rect.bottom + EDGE_MARGIN, window.innerHeight - panelH - EDGE_MARGIN);

      const left = Math.min(Math.max(rect.right - panelW, EDGE_MARGIN), window.innerWidth - panelW - EDGE_MARGIN);

      setPanelPos({ top: Math.max(top, EDGE_MARGIN), left, width: panelW, height: panelH, openFrom: openAbove ? "above" : "below" });
    };

    computePosition();
    window.addEventListener("resize", computePosition);
    return () => window.removeEventListener("resize", computePosition);
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isOpen || messages.length > 0) return;
    const startTimer = setTimeout(() => setIsTyping(true), 0);
    const revealTimer = setTimeout(() => {
      setIsTyping(false);
      setMessages([{ id: nextId(), from: "bot", text: sharkAiContent.greeting }]);
      if (!pendingPrePromptRef.current) setShowQuickReplies(true);
    }, 900);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(revealTimer);
    };
  }, [isOpen, messages.length]);

  // Fire the pre-prompt as a user message once the chatbot is open and has at least the greeting
  useEffect(() => {
    if (!isOpen || !pendingPrePrompt || messages.length === 0) return;
    const prompt = pendingPrePrompt;
    setPendingPrePrompt(null);
    pendingPrePromptRef.current = null;
    setShowQuickReplies(false);
    setApiQuickReplies([]);
    setMessages((m) => [...m, { id: nextId(), from: "user", text: prompt }]);
    askSharkAI(prompt);
    // askSharkAI is stable enough (dispatch + stable setters); adding it would require useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingPrePrompt, messages.length]);

  const askSharkAI = async (message) => {
    setIsTyping(true);
    try {
      const result = await dispatch(sendMessageToSharkAI(message)).unwrap();
      setIsTyping(false);
      setMessages((m) => [...m, { id: nextId(), from: "bot", text: result.reply }]);
      setApiQuickReplies(result.quickReplies ?? []);
    } catch {
      setIsTyping(false);
      const reply = sharkAiContent.fallbackReplies[fallbackIndexRef.current % sharkAiContent.fallbackReplies.length];
      fallbackIndexRef.current += 1;
      setMessages((m) => [...m, { id: nextId(), from: "bot", text: reply }]);
    }
  };

  const handleOpen = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: nextId(), from: "user", text: trimmed }]);
    setInputValue("");
    setShowQuickReplies(false);
    setApiQuickReplies([]);
    askSharkAI(trimmed);
  };

  const handleQuickReply = (item) => {
    setShowQuickReplies(false);
    setApiQuickReplies([]);
    handleSend(item.label);
  };

  const handleClear = () => {
    setMessages([]);
    setShowQuickReplies(false);
    setApiQuickReplies([]);
    setIsTyping(false);
    dispatch(resetSharkAiSession());
  };

  return (
    <>
      <div ref={arenaRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}>
        <motion.div
          ref={launcherRef}
          drag={!isMobile && !isOpen}
          dragConstraints={arenaRef}
          dragElastic={0.12}
          dragTransition={{ bounceStiffness: 420, bounceDamping: 26 }}
          whileDrag={{ cursor: "grabbing" }}
          onDragStart={() => {
            draggedRef.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4) draggedRef.current = true;
          }}
          style={{
            position: "absolute",
            bottom: "clamp(1.25rem, 4vw, 2.25rem)",
            right: "clamp(1.25rem, 4vw, 2.25rem)",
            pointerEvents: "auto",
            cursor: !isMobile && !isOpen ? "grab" : "default"
          }}
        >
          <ChatOrbLauncher visible={!isOpen} hasUnread={hasUnread} onClick={handleOpen} />
        </motion.div>
      </div>

      {createPortal(
        <div ref={portalArenaRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9997 }}>
          <AnimatePresence>
            {isOpen && isMobile && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(2,3,8,0.72)",
                  pointerEvents: "auto",
                  zIndex: 9997
                }}
              />
            )}
            {isOpen && (isMobile || panelPos) && (
              <ChatBotPanel
                key="panel"
                isMobile={isMobile}
                panelPos={panelPos}
                dragConstraints={portalArenaRef}
                messages={messages}
                animatedIds={animatedIdsRef.current}
                onMessageAnimated={markAnimated}
                isTyping={isTyping}
                quickReplies={showQuickReplies ? sharkAiContent.quickReplies : apiQuickReplies.map((q) => ({ label: q }))}
                showQuickReplies={showQuickReplies || apiQuickReplies.length > 0}
                onQuickReply={handleQuickReply}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSend}
                onClear={handleClear}
                onClose={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}
