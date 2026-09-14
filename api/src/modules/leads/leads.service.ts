import { Injectable } from "@nestjs/common";
import { leads } from "@models/leads";
import { DatabaseService } from "@modules/database/database.service";
import { CreateLeadDto } from "@modules/leads/leads.dto";

@Injectable()
export class LeadsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateLeadDto) {
    const [newLead] = await this.databaseService.db.insert(leads).values(dto).returning();
    return { lead: newLead };
  }

  async findAll() {
    return { leads: await this.databaseService.db.select().from(leads) };
  }
}
