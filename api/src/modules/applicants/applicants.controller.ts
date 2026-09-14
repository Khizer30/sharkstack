import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateApplicantDto } from "@modules/applicants/applicants.dto";
import { ApplicantsService } from "@modules/applicants/applicants.service";

@Controller("applicants")
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("resume"))
  async create(
    @Body() dto: CreateApplicantDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: "Resume must be less than 5MB"
          }),
          new FileTypeValidator({
            fileType: /(pdf|msword|document)/
          })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.applicantsService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.applicantsService.findAll();
  }
}
