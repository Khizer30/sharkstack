import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export interface Subheading {
  title: string;
  description: string;
}

export const services = pgTable("services", {
  id: cuid().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  subheadings: jsonb().$type<Subheading[]>().notNull()
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
