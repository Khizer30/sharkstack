import { Module } from "@nestjs/common";
import { BrevoService } from "@modules/brevo/brevo.service";

@Module({
  providers: [BrevoService],
  exports: [BrevoService]
})
export class BrevoModule {}
