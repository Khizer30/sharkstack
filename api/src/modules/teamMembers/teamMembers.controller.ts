import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateTeamMemberDto } from "@modules/teamMembers/teamMembers.dto";
import { TeamMembersService } from "@modules/teamMembers/teamMembers.service";

@Controller("team-members")
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  @UseInterceptors(FileInterceptor("profileImage"))
  async create(
    @Body() dto: CreateTeamMemberDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: "Profile image must be less than 10MB"
          }),
          new FileTypeValidator({
            fileType: /image\//
          })
        ],
        fileIsRequired: true
      })
    )
    file: Express.Multer.File
  ) {
    return this.teamMembersService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.teamMembersService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.teamMembersService.remove(id);
  }
}
