import { Module } from "@nestjs/common";
import { ApplicantsController } from "@modules/applicants/applicants.controller";
import { ApplicantsService } from "@modules/applicants/applicants.service";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  controllers: [ApplicantsController],
  providers: [ApplicantsService]
})
export class ApplicantsModule {}
