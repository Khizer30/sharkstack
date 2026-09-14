import { Module } from "@nestjs/common";
import { LeadsController } from "@modules/leads/leads.controller";
import { LeadsService } from "@modules/leads/leads.service";

@Module({
  controllers: [LeadsController],
  providers: [LeadsService]
})
export class LeadsModule {}
