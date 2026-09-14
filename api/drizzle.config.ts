import path from "path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: path.resolve(__dirname, ".env") });
config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
