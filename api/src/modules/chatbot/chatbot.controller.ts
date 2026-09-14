import { Controller, Post, Body } from "@nestjs/common";
import { ChatMessageDto } from "@modules/chatbot/chatbot.dto";
import { ChatbotService } from "@modules/chatbot/chatbot.service";

@Controller("chatbot")
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post("chat")
  async chat(@Body() dto: ChatMessageDto) {
    return this.chatbotService.chat(dto);
  }
}
