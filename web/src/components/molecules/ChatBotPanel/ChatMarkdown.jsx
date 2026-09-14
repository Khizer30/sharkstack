import { useState } from "react";
import { colors } from "@/constants/colors";

const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+)\)$/;
const BULLET_LINE = /^[-*]\s+(.*)$/;
const INLINE_TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\S+?)\)/g;

function renderInline(text, keyPrefix) {
  const nodes = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE_TOKEN)) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${key}`}>{renderInline(match[1], `${keyPrefix}-b${key++}`)}</strong>);
    } else {
      nodes.push(
        <a
          key={`${keyPrefix}-a${key++}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary, textDecoration: "underline" }}
        >
          {match[2]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function parseBlocks(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");
  const blocks = [];
  let listItems = null;

  const flushList = () => {
    if (listItems) {
      blocks.push({ type: "list", items: listItems });
      listItems = null;
    }
  };

  for (const line of lines) {
    const imageMatch = line.match(IMAGE_LINE);
    const bulletMatch = line.match(BULLET_LINE);

    if (imageMatch) {
      const image = { alt: imageMatch[1], src: imageMatch[2] };
      if (listItems && listItems.length > 0) {
        listItems[listItems.length - 1].image = image;
      } else {
        blocks.push({ type: "image", ...image });
      }
    } else if (bulletMatch) {
      listItems = listItems ?? [];
      listItems.push({ text: bulletMatch[1] });
    } else {
      flushList();
      blocks.push({ type: "text", text: line });
    }
  }
  flushList();

  return blocks;
}

function ChatImage({ src, alt, style }) {
  const [state, setState] = useState("loading");

  if (state === "error") {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "5rem",
          background: `${colors.white}0D`,
          color: `${colors.white}66`,
          fontSize: "0.75rem",
          textAlign: "center",
          padding: "0.5rem"
        }}
      >
        {alt || "Image unavailable"}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", ...style }}>
      {state === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `${colors.white}0D`,
            animation: "chat-image-pulse 1.4s ease-in-out infinite"
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        style={{
          maxWidth: "100%",
          borderRadius: "inherit",
          display: "block",
          opacity: state === "loaded" ? 1 : 0,
          transition: "opacity 0.2s"
        }}
      />
    </div>
  );
}

export default function ChatMarkdown({ text, cursor }) {
  const blocks = parseBlocks(text);
  const lastIndex = blocks.length - 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <style>{`@keyframes chat-image-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
      {blocks.map((block, i) => {
        const isLast = i === lastIndex;

        if (block.type === "list") {
          const lastItemIndex = block.items.length - 1;
          return (
            <ul key={i} style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {block.items.map((item, j) => (
                <li key={j} style={{ marginBottom: "0.3rem" }}>
                  {renderInline(item.text, `l${i}-${j}`)}
                  {isLast && j === lastItemIndex && !item.image && cursor}
                  {item.image && <ChatImage src={item.image.src} alt={item.image.alt} style={{ borderRadius: "0.5rem", marginTop: "0.3rem" }} />}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "image") {
          return <ChatImage key={i} src={block.src} alt={block.alt} style={{ borderRadius: "0.5rem" }} />;
        }
        return (
          <p key={i} style={{ margin: 0 }}>
            {renderInline(block.text, `p${i}`)}
            {isLast && cursor}
          </p>
        );
      })}
    </div>
  );
}
