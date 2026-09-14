import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ActivitiesService } from "@modules/activities/activities.service";

@Controller("activities")
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100 * 1024 * 1024,
            message: "File must be less than 100MB"
          }),
          new FileTypeValidator({
            fileType: /(image\/|video\/)/
          })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.activitiesService.create(file);
  }

  @Get()
  async findAll() {
    return this.activitiesService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.activitiesService.remove(id);
  }
}
