import { Controller, Post, Get, Delete, Body, Param } from "@nestjs/common";
import { CreateServiceDto } from "@modules/services/services.dto";
import { ServicesService } from "@modules/services/services.service";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.servicesService.remove(id);
  }
}
