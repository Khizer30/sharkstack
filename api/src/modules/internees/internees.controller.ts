import { Controller, Post, Get, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateInterneeDto } from "@modules/internees/internees.dto";
import { InterneesService } from "@modules/internees/internees.service";

@Controller("internees")
export class InterneesController {
  constructor(private readonly interneesService: InterneesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("resume"))
  async create(@Body() dto: CreateInterneeDto, @UploadedFile() file?: Express.Multer.File) {
    return this.interneesService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.interneesService.findAll();
  }
}
