import { pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const internees = pgTable("internees", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  about: text().notNull()
});

export type Internee = typeof internees.$inferSelect;
export type InsertInternee = typeof internees.$inferInsert;
