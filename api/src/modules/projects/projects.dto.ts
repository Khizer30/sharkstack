import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray, IsIn } from "class-validator";
import { Trim, Lowercase } from "@common/transformer";

const PROJECT_STATUSES = ["PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"] as const;

export class CreateProjectDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Trim()
  name: string;

  @IsString({ message: "Client name must be a string" })
  @IsNotEmpty({ message: "Client name is required" })
  @Trim()
  clientName: string;

  @IsEmail({}, { message: "Please enter a valid client email address" })
  @Trim()
  @Lowercase()
  clientEmail: string;

  @IsIn(PROJECT_STATUSES, { message: `Status must be one of: ${PROJECT_STATUSES.join(", ")}` })
  @IsOptional()
  status?: (typeof PROJECT_STATUSES)[number];

  @IsArray({ message: "Services must be an array of strings" })
  @IsString({ each: true, message: "Each service must be a string" })
  services: string[];

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  @Trim()
  description: string;

  @IsString({ message: "Budget must be a string" })
  @IsOptional()
  @Trim()
  budget?: string;

  @IsString({ message: "Deadline must be a string" })
  @IsOptional()
  @Trim()
  deadline?: string;

  @IsString({ message: "Notes must be a string" })
  @IsOptional()
  @Trim()
  notes?: string;
}
