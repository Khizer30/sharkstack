import { Module } from "@nestjs/common";
import { BrevoModule } from "@modules/brevo/brevo.module";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";
import { DatabaseModule } from "@modules/database/database.module";
import { InterneesController } from "@modules/internees/internees.controller";
import { InterneesService } from "@modules/internees/internees.service";
import { SafepayModule } from "@modules/safepay/safepay.module";

@Module({
  imports: [DatabaseModule, BrevoModule, CloudinaryModule, SafepayModule],
  controllers: [InterneesController],
  providers: [InterneesService],
  exports: [InterneesService]
})
export class InterneesModule {}
