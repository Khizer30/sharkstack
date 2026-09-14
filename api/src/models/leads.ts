import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const leads = pgTable("leads", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  companyName: text(),
  companyLink: text(),
  region: text().notNull(),
  phone: text().notNull(),
  services: text().array().notNull(),
  projectDetails: text().notNull(),
  // --- Package sales additions (additive/nullable, backward compatible) ---
  selectedPackage: text(),
  estimatedPrice: text(),
  meetingBooked: boolean().notNull().default(false),
  meetingDates: timestamp("meeting_dates").array()
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
