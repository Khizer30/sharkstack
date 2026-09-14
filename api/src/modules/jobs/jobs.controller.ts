import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { CreateJobDto, UpdateJobDto } from "@modules/jobs/jobs.dto";
import { JobsService } from "@modules/jobs/jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.jobsService.remove(id);
  }
}
