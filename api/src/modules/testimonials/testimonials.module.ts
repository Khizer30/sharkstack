import { Module } from "@nestjs/common";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";
import { TestimonialsController } from "@modules/testimonials/testimonials.controller";
import { TestimonialsService } from "@modules/testimonials/testimonials.service";

@Module({
  imports: [CloudinaryModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService]
})
export class TestimonialsModule {}
