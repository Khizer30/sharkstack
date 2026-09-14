import { pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const teamMembers = pgTable("team_members", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  profileImage: text().notNull(),
  socialLink: text(),
  jobTitle: text().notNull(),
  review: text().notNull()
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
