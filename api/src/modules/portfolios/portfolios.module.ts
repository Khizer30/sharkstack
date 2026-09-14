import { Module } from "@nestjs/common";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";
import { PortfoliosController } from "@modules/portfolios/portfolios.controller";
import { PortfoliosService } from "@modules/portfolios/portfolios.service";

@Module({
  imports: [CloudinaryModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService]
})
export class PortfoliosModule {}
