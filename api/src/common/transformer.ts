import { Transform } from "class-transformer";

export const Trim = () => Transform(({ value }) => (typeof value === "string" ? value.trim() : value));

export const Lowercase = () => Transform(({ value }) => (typeof value === "string" ? value.toLowerCase() : value));

export const ToArray = () =>
  Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => (typeof item === "string" ? item.trim() : item));
        }
      } catch {
        return [value.trim()];
      }
    }
    return value;
  });
