CREATE TYPE "public"."automation_tier" AS ENUM('SIMPLE', 'MEDIUM', 'COMPLEX');--> statement-breakpoint
CREATE TYPE "public"."addon_billing_type" AS ENUM('INCLUDED', 'ONE_TIME', 'MONTHLY');--> statement-breakpoint
CREATE TYPE "public"."chat_tier" AS ENUM('LIMITED', 'UNLIMITED');--> statement-breakpoint
CREATE TYPE "public"."package_note_type" AS ENUM('BUSINESS', 'SALES', 'LEGAL', 'IMPLEMENTATION');--> statement-breakpoint
CREATE TYPE "public"."package_type" AS ENUM('WEBSITE', 'AI_GROWTH', 'AUTOMATION');--> statement-breakpoint
CREATE TABLE "ai_growth_tiers" (
	"id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"voice_minutes" integer NOT NULL,
	"chat_tier" "chat_tier" NOT NULL,
	"monthly_price_cents" integer NOT NULL,
	"included_queries" integer,
	"fair_use_limit" integer
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
CREATE TABLE "automation_tiers" (
	"id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"tier" "automation_tier" NOT NULL,
	"criteria" text NOT NULL,
	"build_fee_min_cents" integer NOT NULL,
	"build_fee_max_cents" integer,
	"monthly_min_cents" integer,
	"monthly_max_cents" integer,
	"is_custom_quote" boolean DEFAULT false NOT NULL,
	CONSTRAINT "automation_tiers_tier_unique" UNIQUE("tier")
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
CREATE TABLE "package_addons" (
	"id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"additional_price_cents" integer DEFAULT 0 NOT NULL,
	"billing_type" "addon_billing_type" DEFAULT 'INCLUDED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_features" (
	"id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"feature" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"note_type" "package_note_type" NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"package_type" "package_type" NOT NULL,
	"description" text NOT NULL,
	"monthly_price_cents" integer,
	"build_fee_cents" integer,
	"setup_fee_min_cents" integer,
	"setup_fee_max_cents" integer,
	"contract_months" integer,
	"early_exit_fee_min_cents" integer,
	"early_exit_fee_max_cents" integer,
	"overage_rate_cents" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"is_custom_quote" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "selected_package" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "estimated_price" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "meeting_booked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_growth_tiers" ADD CONSTRAINT "ai_growth_tiers_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_quotes" ADD CONSTRAINT "automation_quotes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_tiers" ADD CONSTRAINT "automation_tiers_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_addons" ADD CONSTRAINT "package_addons_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_features" ADD CONSTRAINT "package_features_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_notes" ADD CONSTRAINT "package_notes_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;