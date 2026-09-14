import { Module } from "@nestjs/common";
import { DatabaseModule } from "@modules/database/database.module";
import { PackagesController } from "@modules/packages/packages.controller";
import { PackagesService } from "@modules/packages/packages.service";

@Module({
  imports: [DatabaseModule],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService]
})
export class PackagesModule {}
