import { Injectable } from "@nestjs/common";
import { internees } from "@models/internees";
import { BrevoService } from "@modules/brevo/brevo.service";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreateInterneeDto } from "@modules/internees/internees.dto";

@Injectable()
export class InterneesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly brevoService: BrevoService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreateInterneeDto, file?: Express.Multer.File) {
    let resumeUrl: string | undefined;

    // Upload resume to Cloudinary if provided
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file, "internee-resumes");
        resumeUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Failed to upload resume to Cloudinary:", error);
        // Continue without resume URL if upload fails
      }
    }

    const [newInternee] = await this.databaseService.db
      .insert(internees)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        about: dto.about,
        resumeUrl: resumeUrl || null
      })
      .returning();

    // Trigger email notification to admins via Brevo
    await this.brevoService.sendInterneeRegistrationNotification(newInternee);

    return { internee: newInternee };
  }

  async findAll() {
    return { internees: await this.databaseService.db.select().from(internees) };
  }
}
