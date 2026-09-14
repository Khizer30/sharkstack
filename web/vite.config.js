import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.lottie"],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    },
    dedupe: ["three"]
  }
});
