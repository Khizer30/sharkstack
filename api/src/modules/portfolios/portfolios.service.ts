import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { portfolios } from "@models/portfolios";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreatePortfolioDto } from "@modules/portfolios/portfolios.dto";

@Injectable()
export class PortfoliosService {
  private readonly logger = new Logger(PortfoliosService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreatePortfolioDto, files?: Express.Multer.File[]) {
    const mediaUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(file, "portfolios");
          mediaUrls.push(uploadResult.secure_url);
        } catch (error) {
          this.logger.error("Failed to upload file to Cloudinary", error instanceof Error ? error.stack : error);
        }
      }
    }

    const [newPortfolio] = await this.databaseService.db
      .insert(portfolios)
      .values({
        title: dto.title,
        description: dto.description,
        problemAndSolution: dto.problemAndSolution,
        link: dto.link,
        technologies: dto.technologies,
        tools: dto.tools,
        media: mediaUrls
      })
      .returning();

    return { portfolio: newPortfolio };
  }

  async findAll() {
    return { portfolios: await this.databaseService.db.select().from(portfolios) };
  }

  async remove(id: string) {
    const [portfolio] = await this.databaseService.db.select().from(portfolios).where(eq(portfolios.id, id));

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    if (portfolio.media && portfolio.media.length > 0) {
      for (const mediaUrl of portfolio.media) {
        const match = mediaUrl.match(/\/v\d+\/(portfolios\/[^.]+)\./);
        if (match && match[1]) {
          try {
            await this.cloudinaryService.deleteFile(match[1]);
          } catch (error) {
            this.logger.error(`Failed to delete file from Cloudinary: ${mediaUrl}`, error instanceof Error ? error.stack : error);
          }
        }
      }
    }

    await this.databaseService.db.delete(portfolios).where(eq(portfolios.id, id));

    return { message: "Portfolio deleted successfully" };
  }
}
