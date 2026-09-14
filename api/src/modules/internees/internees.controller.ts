import { Controller, Post, Get, Body } from "@nestjs/common";
import { CreateInterneeDto } from "@modules/internees/internees.dto";
import { InterneesService } from "@modules/internees/internees.service";

@Controller("internees")
export class InterneesController {
  constructor(private readonly interneesService: InterneesService) {}

  @Post()
  async create(@Body() dto: CreateInterneeDto) {
    return this.interneesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.interneesService.findAll();
  }
}
