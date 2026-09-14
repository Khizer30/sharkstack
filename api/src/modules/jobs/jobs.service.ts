import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { jobs } from "@models/jobs";
import { DatabaseService } from "@modules/database/database.service";
import { CreateJobDto, UpdateJobDto } from "@modules/jobs/jobs.dto";

@Injectable()
export class JobsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateJobDto) {
    const [newJob] = await this.databaseService.db.insert(jobs).values(dto).returning();
    return { job: newJob };
  }

  async findAll() {
    return { jobs: await this.databaseService.db.select().from(jobs) };
  }

  async findOne(id: string) {
    const [job] = await this.databaseService.db.select().from(jobs).where(eq(jobs.id, id));
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return { job };
  }

  async update(id: string, dto: UpdateJobDto) {
    const [updatedJob] = await this.databaseService.db.update(jobs).set(dto).where(eq(jobs.id, id)).returning();
    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return { job: updatedJob };
  }

  async remove(id: string) {
    const [deletedJob] = await this.databaseService.db.delete(jobs).where(eq(jobs.id, id)).returning();
    if (!deletedJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return { message: "Job deleted successfully" };
  }
}
