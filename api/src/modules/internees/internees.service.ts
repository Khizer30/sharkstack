import { Injectable } from "@nestjs/common";
import { internees } from "@models/internees";
import { BrevoService } from "@modules/brevo/brevo.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreateInterneeDto } from "@modules/internees/internees.dto";

@Injectable()
export class InterneesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly brevoService: BrevoService
  ) {}

  async create(dto: CreateInterneeDto) {
    const [newInternee] = await this.databaseService.db
      .insert(internees)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        about: dto.about
      })
      .returning();

    // Trigger email notification to admins via Brevo
    await this.brevoService.sendInterneeRegistrationNotification(newInternee);

    return { internee: newInternee };
  }

  async findAll() {
    return { internees: await this.databaseService.db.select().from(internees) };
  }
}
