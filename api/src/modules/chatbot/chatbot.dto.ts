import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { Trim } from "@common/transformer";

export class ChatMessageDto {
  @IsString({ message: "Message must be a string" })
  @IsNotEmpty({ message: "Message is required" })
  @MaxLength(2000, { message: "Message must not exceed 2000 characters" })
  @Trim()
  message: string;

  @IsString({ message: "Session ID must be a string" })
  @IsOptional()
  @Trim()
  sessionId?: string;
}
