ALTER TABLE "leads" ADD COLUMN "meeting_dates" timestamp[];--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "package_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;