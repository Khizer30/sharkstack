CREATE TYPE "public"."job_department" AS ENUM('DESIGN', 'DEVELOPMENT', 'MARKETING', 'SALES', 'HR', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT');--> statement-breakpoint
CREATE TYPE "public"."work_nature" AS ENUM('ON_SITE', 'REMOTE', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."automation_tier" AS ENUM('SIMPLE', 'MEDIUM', 'COMPLEX');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"media_url" text NOT NULL,
	"media_public_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"phone" text NOT NULL,
	"resume_url" text NOT NULL,
	"job_id" text
);
--> statement-breakpoint
CREATE TABLE "internees" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"about" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"department" "job_department" NOT NULL,
	"work_nature" "work_nature" NOT NULL,
	"type" "job_type" NOT NULL,
	"responsibilities" text NOT NULL,
	"requirements" text NOT NULL,
	"benefits" text[] NOT NULL,
	"skills" text[] NOT NULL,
	"additional_skills" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company_name" text,
	"company_link" text,
	"region" text NOT NULL,
	"phone" text NOT NULL,
	"services" text[] NOT NULL,
	"project_details" text NOT NULL,
	"selected_package" text,
	"estimated_price" text,
	"meeting_booked" boolean DEFAULT false NOT NULL,
	"meeting_dates" timestamp[]
);
--> statement-breakpoint
CREATE TABLE "automation_quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text,
	"steps" integer NOT NULL,
	"integrations" integer NOT NULL,
	"logic_complexity" text NOT NULL,
	"ai_decisioning" boolean NOT NULL,
	"monthly_volume" integer NOT NULL,
	"estimated_tier" "automation_tier" NOT NULL,
	"build_estimate_min_cents" integer NOT NULL,
	"build_estimate_max_cents" integer,
	"monthly_estimate_min_cents" integer,
	"monthly_estimate_max_cents" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text,
	"google_event_id" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"attendee_email" text NOT NULL,
	"calendar_account" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"price_cents" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"problem_and_solution" text NOT NULL,
	"link" text,
	"technologies" text[] NOT NULL,
	"tools" text[] NOT NULL,
	"media" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"status" "project_status" DEFAULT 'PLANNING' NOT NULL,
	"services" text[] NOT NULL,
	"description" text NOT NULL,
	"budget" text,
	"deadline" text,
	"notes" text,
	"package_id" text
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"subheadings" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profile_image" text NOT NULL,
	"social_link" text,
	"job_title" text NOT NULL,
	"review" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"client_name" text NOT NULL,
	"company" text NOT NULL,
	"review" text NOT NULL,
	"client_image_url" text
);
--> statement-breakpoint
ALTER TABLE "automation_quotes" ADD CONSTRAINT "automation_quotes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;