import { textVariants } from "@/constants/typography";

/**
 * Unified text component. Pick a variant for consistent typography across the app.
 *
 * Usage:
 *   <Text variant="h1">Page title</Text>
 *   <Text variant="body" color="#fff" style={{ marginBottom: 8 }}>Body copy</Text>
 *   <Text variant="label" as="label" htmlFor="email">Email</Text>
 */
export default function Text({ children, variant = "body", as: Tag = "span", color, style, ...props }) {
  const base = textVariants[variant] ?? textVariants.body;
  const combined = { ...base, ...(color ? { color } : {}), ...style };

  return (
    <Tag style={combined} {...props}>
      {children}
    </Tag>
  );
}
