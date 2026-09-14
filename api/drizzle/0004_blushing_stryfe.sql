CREATE TABLE "internees" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"about" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "ai_growth_tiers" CASCADE;--> statement-breakpoint
DROP TABLE "automation_tiers" CASCADE;--> statement-breakpoint
DROP TABLE "package_addons" CASCADE;--> statement-breakpoint
DROP TABLE "package_features" CASCADE;--> statement-breakpoint
DROP TABLE "package_notes" CASCADE;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "features" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "price_cents" integer;--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "package_type";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "monthly_price_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "build_fee_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "setup_fee_min_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "setup_fee_max_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "contract_months";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "early_exit_fee_min_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "early_exit_fee_max_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "overage_rate_cents";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "is_custom_quote";--> statement-breakpoint
DROP TYPE "public"."addon_billing_type";--> statement-breakpoint
DROP TYPE "public"."chat_tier";--> statement-breakpoint
DROP TYPE "public"."package_note_type";--> statement-breakpoint
DROP TYPE "public"."package_type";