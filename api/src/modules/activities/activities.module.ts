import { Module } from "@nestjs/common";
import { ActivitiesController } from "@modules/activities/activities.controller";
import { ActivitiesService } from "@modules/activities/activities.service";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService]
})
export class ActivitiesModule {}
