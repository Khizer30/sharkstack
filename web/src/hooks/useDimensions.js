import { useState, useEffect } from "react";

export function useDimensions(ref) {
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ width, height });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  return dims;
}
