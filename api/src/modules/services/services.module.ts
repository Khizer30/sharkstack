import { Module } from "@nestjs/common";
import { DatabaseModule } from "@modules/database/database.module";
import { ServicesController } from "@modules/services/services.controller";
import { ServicesService } from "@modules/services/services.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
