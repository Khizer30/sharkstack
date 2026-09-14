import { pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const portfolios = pgTable("portfolios", {
  id: cuid().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  problemAndSolution: text().notNull(),
  link: text(),
  technologies: text().array().notNull(),
  tools: text().array().notNull(),
  media: text().array().notNull()
});

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = typeof portfolios.$inferInsert;
