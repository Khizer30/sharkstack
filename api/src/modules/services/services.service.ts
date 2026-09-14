import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { services } from "@models/services";
import { DatabaseService } from "@modules/database/database.service";
import { CreateServiceDto } from "@modules/services/services.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateServiceDto) {
    const [newService] = await this.databaseService.db
      .insert(services)
      .values({
        title: dto.title,
        description: dto.description,
        subheadings: dto.subheadings
      })
      .returning();

    return { service: newService };
  }

  async findAll() {
    return { services: await this.databaseService.db.select().from(services) };
  }

  async remove(id: string) {
    const [service] = await this.databaseService.db.select().from(services).where(eq(services.id, id));

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    await this.databaseService.db.delete(services).where(eq(services.id, id));

    return { message: "Service deleted successfully" };
  }
}
