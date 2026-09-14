import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";
import { packages } from "./packages";

export const projectStatusEnum = pgEnum("project_status", ["DRAFT", "PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"]);
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];

export const projects = pgTable("projects", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  clientName: text().notNull(),
  clientEmail: text().notNull(),
  status: projectStatusEnum().notNull().default("PLANNING"),
  services: text().array().notNull(),
  description: text().notNull(),
  budget: text(),
  deadline: text(),
  notes: text(),
  packageId: text("package_id").references(() => packages.id, { onDelete: "set null" })
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
