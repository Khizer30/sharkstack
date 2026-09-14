import { pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const applicants = pgTable("applicants", {
  id: cuid().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  phone: text().notNull(),
  resumeUrl: text().notNull(),
  jobId: text()
});

export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = typeof applicants.$inferInsert;
