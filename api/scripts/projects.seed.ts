import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { projects } from "@models/projects";
import { DatabaseService } from "@modules/database/database.service";
import { AppModule } from "@src/app.module";

// Seed Projects
(async () => {
  const logger = new Logger("ProjectsSeed");
  const app = await NestFactory.createApplicationContext(AppModule);

  const databaseService = app.get(DatabaseService);
  const db = databaseService.db;

  try {
    const inserted = await db
      .insert(projects)
      .values([
        {
          name: "SharkStack Website Revamp",
          clientName: "Ali Raza",
          clientEmail: "ali.raza@example.com",
          status: "IN_PROGRESS",
          services: ["Web Development", "SEO"],
          description: "Full redesign and SEO setup for client website",
          budget: "$5,000",
          deadline: "2026-09-30",
          notes: "Kickoff call done, wireframes in progress"
        },
        {
          name: "Internal CRM Build",
          clientName: "SharkStack Internal",
          clientEmail: "admin@sharkstack.dev",
          status: "PLANNING",
          services: ["Web Development"],
          description: "Building out the internal admin CRM"
        },
        {
          name: "Mobile App MVP",
          clientName: "Zeeshan Khan",
          clientEmail: "zeeshan@example.com",
          status: "COMPLETED",
          services: ["Mobile Development", "UI/UX Design"],
          description: "Cross-platform MVP for client's fitness app",
          budget: "$12,000",
          deadline: "2026-04-15"
        }
      ])
      .returning();

    logger.log(`Inserted ${inserted.length} projects:`);
    inserted.forEach((p) => {
      logger.log(`  - [ID: ${p.id}] ${p.name} (${p.status})`);
    });
  } catch (error) {
    logger.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
})();
