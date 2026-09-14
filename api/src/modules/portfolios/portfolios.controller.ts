import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreatePortfolioDto } from "@modules/portfolios/portfolios.dto";
import { PortfoliosService } from "@modules/portfolios/portfolios.service";

@Controller("portfolios")
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("media"))
  async create(
    @Body() dto: CreatePortfolioDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 50 * 1024 * 1024,
            message: "Media files must be less than 50MB"
          }),
          new FileTypeValidator({
            fileType: /(image|video)\//
          })
        ],
        fileIsRequired: false
      })
    )
    files?: Express.Multer.File[]
  ) {
    return this.portfoliosService.create(dto, files);
  }

  @Get()
  async findAll() {
    return this.portfoliosService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.portfoliosService.remove(id);
  }
}
