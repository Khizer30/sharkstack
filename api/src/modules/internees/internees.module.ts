import { Module } from "@nestjs/common";
import { BrevoModule } from "@modules/brevo/brevo.module";
import { DatabaseModule } from "@modules/database/database.module";
import { InterneesController } from "@modules/internees/internees.controller";
import { InterneesService } from "@modules/internees/internees.service";

@Module({
  imports: [DatabaseModule, BrevoModule],
  controllers: [InterneesController],
  providers: [InterneesService],
  exports: [InterneesService]
})
export class InterneesModule {}
