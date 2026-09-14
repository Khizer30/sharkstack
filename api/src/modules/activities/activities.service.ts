import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { eq, desc } from "drizzle-orm";
import { activities } from "@models/activities";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(file: Express.Multer.File) {
    const uploadResult = await this.cloudinaryService.uploadFile(file, "activities");
    const [newActivity] = await this.databaseService.db
      .insert(activities)
      .values({
        mediaURL: uploadResult.secure_url,
        mediaPublicID: uploadResult.public_id
      })
      .returning();
    return { activity: newActivity };
  }

  async findAll() {
    return {
      activities: await this.databaseService.db.select().from(activities).orderBy(desc(activities.createdAt))
    };
  }

  async remove(id: string) {
    const [activity] = await this.databaseService.db.select().from(activities).where(eq(activities.id, id));

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    try {
      await this.cloudinaryService.deleteFile(activity.mediaPublicID);
    } catch (error) {
      this.logger.error(`Failed to delete file from Cloudinary for activity ${id}`, error instanceof Error ? error.stack : error);
    }

    await this.databaseService.db.delete(activities).where(eq(activities.id, id));

    return { message: "Activity deleted successfully" };
  }
}
