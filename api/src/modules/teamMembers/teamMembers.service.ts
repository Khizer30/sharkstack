import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { teamMembers } from "@models/teamMembers";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreateTeamMemberDto } from "@modules/teamMembers/teamMembers.dto";

@Injectable()
export class TeamMembersService {
  private readonly logger = new Logger(TeamMembersService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: CreateTeamMemberDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Profile image file is required");
    }

    const uploadResult = await this.cloudinaryService.uploadFile(file, "team_members");
    const profileImage = uploadResult.secure_url;

    const [newMember] = await this.databaseService.db
      .insert(teamMembers)
      .values({
        name: dto.name,
        profileImage,
        socialLink: dto.socialLink || null,
        jobTitle: dto.jobTitle,
        review: dto.review
      })
      .returning();

    return { teamMember: newMember };
  }

  async findAll() {
    return { teamMembers: await this.databaseService.db.select().from(teamMembers) };
  }

  async remove(id: string) {
    const [member] = await this.databaseService.db.select().from(teamMembers).where(eq(teamMembers.id, id));

    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    if (member.profileImage) {
      const match = member.profileImage.match(/\/v\d+\/(team_members\/[^.]+)\./);
      if (match && match[1]) {
        try {
          await this.cloudinaryService.deleteFile(match[1]);
        } catch (error) {
          this.logger.error(`Failed to delete profile image from Cloudinary for team member ${id}`, error instanceof Error ? error.stack : error);
        }
      }
    }

    await this.databaseService.db.delete(teamMembers).where(eq(teamMembers.id, id));

    return { message: "Team member deleted successfully" };
  }
}
