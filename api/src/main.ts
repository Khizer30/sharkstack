import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { HttpExceptionFilter } from "@common/http-exception.filter";
import { ResponseInterceptor } from "@common/response.interceptor";
import { AppModule } from "@src/app.module";

// Bootstrap
(async (): Promise<undefined> => {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);

  const corsOriginsVal = configService.get<string>("CORS_ORIGINS");
  const corsOrigins = corsOriginsVal ? corsOriginsVal.split(",").map((origin) => origin.trim()) : true;

  app.set("trust proxy", "loopback");
  app.use(helmet());
  app.enableCors({ origin: corsOrigins, credentials: true });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 5000);
})();
