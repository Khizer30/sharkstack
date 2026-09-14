import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { testimonials } from "@models/testimonials";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreateTestimonialDto } from "@modules/testimonials/testimonials.dto";

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreateTestimonialDto, file?: Express.Multer.File) {
    let clientImageURL: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, "testimonials");
      clientImageURL = uploadResult.secure_url;
    }

    const [newTestimonial] = await this.databaseService.db
      .insert(testimonials)
      .values({
        clientName: dto.clientName,
        company: dto.company,
        review: dto.review,
        clientImageURL
      })
      .returning();

    return { testimonial: newTestimonial };
  }

  async findAll() {
    return { testimonials: await this.databaseService.db.select().from(testimonials) };
  }

  async remove(id: string) {
    const [testimonial] = await this.databaseService.db.select().from(testimonials).where(eq(testimonials.id, id));

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    if (testimonial.clientImageURL) {
      const match = testimonial.clientImageURL.match(/\/v\d+\/(testimonials\/[^.]+)\./);
      if (match && match[1]) {
        try {
          await this.cloudinaryService.deleteFile(match[1]);
        } catch (error) {
          this.logger.error(`Failed to delete file from Cloudinary for testimonial ${id}`, error instanceof Error ? error.stack : error);
        }
      }
    }

    await this.databaseService.db.delete(testimonials).where(eq(testimonials.id, id));

    return { message: "Testimonial deleted successfully" };
  }
}
