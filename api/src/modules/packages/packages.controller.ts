import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { CreatePackageDto, UpdatePackageDto } from "@modules/packages/packages.dto";
import { PackagesService } from "@modules/packages/packages.service";

@Controller("packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.packagesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.packagesService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.packagesService.remove(id);
  }
}
