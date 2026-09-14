import { pgEnum, pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";
import { leads } from "@models/leads";

export const automationTierEnum = pgEnum("automation_tier", ["SIMPLE", "MEDIUM", "COMPLEX"]);
export type AutomationTier = (typeof automationTierEnum.enumValues)[number];

export const packages = pgTable("packages", {
  id: cuid().primaryKey(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  description: text().notNull(),
  features: text().array().notNull().default([]),
  priceCents: integer(), // null = custom pricing (contact us)
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

/**
 * Persisted output of the Workflow Automation discovery flow.
 * One row per completed chatbot quote session. Linked to a lead if one
 * was captured in the same conversation; nullable so the record is still
 * useful even when the visitor didn't leave contact details.
 */
export const automationQuotes = pgTable("automation_quotes", {
  id: cuid().primaryKey(),
  leadId: text().references(() => leads.id, { onDelete: "set null" }),
  steps: integer().notNull(),
  integrations: integer().notNull(),
  logicComplexity: text().notNull(),
  aiDecisioning: boolean().notNull(),
  monthlyVolume: integer().notNull(),
  estimatedTier: automationTierEnum().notNull(),
  buildEstimateMinCents: integer().notNull(),
  buildEstimateMaxCents: integer(),
  monthlyEstimateMinCents: integer(),
  monthlyEstimateMaxCents: integer(),
  createdAt: timestamp().notNull().defaultNow()
});

export type AutomationQuote = typeof automationQuotes.$inferSelect;
export type InsertAutomationQuote = typeof automationQuotes.$inferInsert;

/**
 * Google Calendar meetings booked through the chatbot.
 * `googleEventId` allows the meeting to be looked up / cancelled via the
 * Calendar API later. Linked to a lead record so the booking shows up in
 * the CRM pipeline.
 */
export const bookings = pgTable("bookings", {
  id: cuid().primaryKey(),
  leadId: text().references(() => leads.id, { onDelete: "set null" }),
  googleEventId: text(),
  startTime: timestamp().notNull(),
  endTime: timestamp().notNull(),
  attendeeEmail: text().notNull(),
  calendarAccount: text().notNull(),
  createdAt: timestamp().notNull().defaultNow()
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
