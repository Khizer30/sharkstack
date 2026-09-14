import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const activities = pgTable("activities", {
  id: cuid().primaryKey(),
  mediaURL: text().notNull(),
  mediaPublicID: text().notNull(),
  createdAt: timestamp().defaultNow().notNull()
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;
