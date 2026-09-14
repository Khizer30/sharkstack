import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { packages } from "@models/packages";
import { DatabaseService } from "@modules/database/database.service";
import { AppModule } from "@src/app.module";

(async () => {
  const logger = new Logger("PackagesSeed");
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["error", "warn"] });
  const db = app.get(DatabaseService).db;

  try {
    logger.log("Seeding packages...");

    await db
      .insert(packages)
      .values([
        {
          slug: "website-essentials",
          title: "Website Essentials",
          description: "A fully built, hosted, and maintained website with no upfront build fee — everything you need to get online fast.",
          features: [
            "Custom website design & development",
            "Domain registration + renewal",
            "Hosting included",
            "Monthly maintenance & updates",
            "2–3 add-ons of your choice (contact form, maps, SEO, blog, booking widget, etc.)"
          ],
          priceCents: 9700,
          isActive: true
        },
        {
          slug: "ai-growth-suite",
          title: "AI Growth Suite",
          description:
            "A full-stack AI-powered solution — custom website or mobile app with payment integration, an AI inbound voice receptionist, and an AI chatbot trained on your business data.",
          features: [
            "Custom website or mobile app",
            "Stripe / PayPal payment integration",
            "AI inbound voice receptionist (call handling, booking, FAQ, routing)",
            "AI chatbot trained on your docs, FAQ, and site content",
            "Monthly usage dashboard (voice minutes + chat queries)"
          ],
          priceCents: 39700,
          isActive: true
        },
        {
          slug: "workflow-automation",
          title: "Workflow Automation",
          description: "Custom-quoted automation build tailored to your workflow's complexity — from simple integrations to AI-powered multi-system pipelines.",
          features: [
            "Discovery call to scope your workflow",
            "Custom automation build (n8n / Zapier / Make / custom code)",
            "Multi-system integrations",
            "Conditional logic, branching & error handling",
            "Optional AI decision-making nodes",
            "Ongoing monthly maintenance"
          ],
          priceCents: null,
          isActive: true
        }
      ])
      .onConflictDoUpdate({
        target: packages.slug,
        set: {
          title: packages.title,
          description: packages.description,
          features: packages.features,
          priceCents: packages.priceCents,
          isActive: packages.isActive,
          updatedAt: new Date()
        }
      });

    logger.log("✅ Packages seed complete.");
  } catch (error) {
    logger.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
})();
