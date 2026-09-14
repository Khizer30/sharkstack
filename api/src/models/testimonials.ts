import { pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const testimonials = pgTable("testimonials", {
  id: cuid().primaryKey(),
  clientName: text().notNull(),
  company: text().notNull(),
  review: text().notNull(),
  clientImageURL: text()
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
