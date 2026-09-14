import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import cuid from "@common/cuid";

export const jobDepartmentEnum = pgEnum("job_department", ["DESIGN", "DEVELOPMENT", "MARKETING", "SALES", "HR", "OTHER"]);
export type JobDepartment = (typeof jobDepartmentEnum.enumValues)[number];

export const workNatureEnum = pgEnum("work_nature", ["ON_SITE", "REMOTE", "HYBRID"]);
export type WorkNature = (typeof workNatureEnum.enumValues)[number];

export const jobTypeEnum = pgEnum("job_type", ["FULL_TIME", "PART_TIME", "CONTRACT"]);
export type JobType = (typeof jobTypeEnum.enumValues)[number];

export const jobs = pgTable("jobs", {
  id: cuid().primaryKey(),
  title: text().notNull(),
  department: jobDepartmentEnum().notNull(),
  workNature: workNatureEnum().notNull(),
  type: jobTypeEnum().notNull(),
  responsibilities: text().notNull(),
  requirements: text().notNull(),
  benefits: text().array().notNull(),
  skills: text().array().notNull(),
  additionalSkills: text().array().notNull()
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
