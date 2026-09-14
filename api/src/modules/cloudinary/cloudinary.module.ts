import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "@modules/cloudinary/cloudinary.provider";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider]
})
export class CloudinaryModule {}
