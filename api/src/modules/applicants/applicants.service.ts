import { Injectable } from "@nestjs/common";
import { applicants } from "@models/applicants";
import { CreateApplicantDto } from "@modules/applicants/applicants.dto";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";

@Injectable()
export class ApplicantsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreateApplicantDto, file: Express.Multer.File) {
    const uploadResult = await this.cloudinaryService.uploadFile(file, "applicants");
    const [newApplicant] = await this.databaseService.db
      .insert(applicants)
      .values({
        ...dto,
        resumeUrl: uploadResult.secure_url
      })
      .returning();
    return { applicant: newApplicant };
  }

  async findAll() {
    return { applicants: await this.databaseService.db.select().from(applicants) };
  }
}
