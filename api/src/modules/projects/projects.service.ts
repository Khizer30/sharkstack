import { Injectable } from "@nestjs/common";
import { projects } from "@models/projects";
import { DatabaseService } from "@modules/database/database.service";
import { CreateProjectDto } from "@modules/projects/projects.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateProjectDto) {
    const [newProject] = await this.databaseService.db.insert(projects).values(dto).returning();
    return { project: newProject };
  }

  async findAll() {
    return { projects: await this.databaseService.db.select().from(projects) };
  }
}
