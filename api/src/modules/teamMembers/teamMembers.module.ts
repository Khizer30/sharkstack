import { Module } from "@nestjs/common";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";
import { DatabaseModule } from "@modules/database/database.module";
import { TeamMembersController } from "@modules/teamMembers/teamMembers.controller";
import { TeamMembersService } from "@modules/teamMembers/teamMembers.service";

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService]
})
export class TeamMembersModule {}
