import { pgTable, text, pgEnum, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "PAID", "FAILED"]);
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export const internees = pgTable("internees", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  about: text().notNull(),
  resumeUrl: text(),

  paymentStatus: paymentStatusEnum().notNull().default("PENDING"),
  amountUsdCents: integer().notNull().default(10800),
  exchangeRate: doublePrecision(),
  amountPkrCents: integer(),
  safepayTrackerToken: text(),
  paidAt: timestamp()
});

export type Internee = typeof internees.$inferSelect;
export type InsertInternee = typeof internees.$inferInsert;
