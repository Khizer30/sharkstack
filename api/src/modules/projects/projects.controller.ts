import { Controller, Post, Get, Body } from "@nestjs/common";
import { CreateProjectDto } from "@modules/projects/projects.dto";
import { ProjectsService } from "@modules/projects/projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }
}
