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
import { CreateTestimonialDto } from "@modules/testimonials/testimonials.dto";
import { TestimonialsService } from "@modules/testimonials/testimonials.service";

@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("clientImage"))
  async create(
    @Body() dto: CreateTestimonialDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: "Client image must be less than 10MB"
          }),
          new FileTypeValidator({
            fileType: /image\//
          })
        ],
        fileIsRequired: false
      })
    )
    file?: Express.Multer.File
  ) {
    return this.testimonialsService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.testimonialsService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.testimonialsService.remove(id);
  }
}
