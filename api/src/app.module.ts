import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerMiddleware } from "@middleware/logger.middleware";
import { ActivitiesModule } from "@modules/activities/activities.module";
import { ApplicantsModule } from "@modules/applicants/applicants.module";
import { BrevoModule } from "@modules/brevo/brevo.module";
import { ChatbotModule } from "@modules/chatbot/chatbot.module";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";
import { DatabaseModule } from "@modules/database/database.module";
import { InterneesModule } from "@modules/internees/internees.module";
import { JobsModule } from "@modules/jobs/jobs.module";
import { LeadsModule } from "@modules/leads/leads.module";
import { PackagesModule } from "@modules/packages/packages.module";
import { PortfoliosModule } from "@modules/portfolios/portfolios.module";
import { ProjectsModule } from "@modules/projects/projects.module";
import { ServicesModule } from "@modules/services/services.module";
import { TeamMembersModule } from "@modules/teamMembers/teamMembers.module";
import { TestimonialsModule } from "@modules/testimonials/testimonials.module";
import { AppController } from "@src/app.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    DatabaseModule,
    CloudinaryModule,
    BrevoModule,
    LeadsModule,
    ApplicantsModule,
    ProjectsModule,
    ChatbotModule,
    JobsModule,
    TestimonialsModule,
    PortfoliosModule,
    ActivitiesModule,
    ServicesModule,
    TeamMembersModule,
    PackagesModule,
    InterneesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
