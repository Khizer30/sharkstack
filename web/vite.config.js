import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const rootDir = new URL("..", import.meta.url).pathname;
const webDir = new URL(".", import.meta.url).pathname;

export default defineConfig(({ mode }) => {
  const localEnv = loadEnv(mode, webDir);

  return {
    plugins: [react(), tailwindcss()],
    assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.lottie"],
    envDir: rootDir,
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname
      },
      dedupe: ["three"]
    },
    define: Object.fromEntries(Object.entries(localEnv).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]))
  };
});
