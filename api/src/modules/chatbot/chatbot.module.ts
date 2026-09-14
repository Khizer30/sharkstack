import { Module } from "@nestjs/common";
import { ChatbotController } from "@modules/chatbot/chatbot.controller";
import { ChatbotService } from "@modules/chatbot/chatbot.service";
import { GoogleCalendarService } from "@modules/chatbot/googleCalendar.service";
import { SessionMemoryService } from "@modules/chatbot/sessionMemory.service";

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, SessionMemoryService, GoogleCalendarService]
})
export class ChatbotModule {}
