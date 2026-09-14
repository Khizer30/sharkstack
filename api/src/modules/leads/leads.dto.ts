import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUrl, IsArray, Matches } from "class-validator";
import { Trim, Lowercase } from "@common/transformer";

export class CreateLeadDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Trim()
  name: string;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @Trim()
  @Lowercase()
  email: string;

  @IsString({ message: "Company name must be a string" })
  @IsOptional()
  @Trim()
  companyName?: string;

  @IsUrl({}, { message: "Company link must be a valid URL" })
  @IsOptional()
  @Trim()
  companyLink?: string;

  @IsString({ message: "Region must be a string" })
  @IsNotEmpty({ message: "Region is required" })
  @Trim()
  region: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^\+?[\d ]+$/, { message: "Phone number must contain only digits and spaces, and optionally start with +" })
  @Trim()
  phone: string;

  @IsArray({ message: "Services must be an array of strings" })
  @IsString({ each: true, message: "Each service must be a string" })
  services: string[];

  @IsString({ message: "Project details must be a string" })
  @IsNotEmpty({ message: "Project details are required" })
  @Trim()
  projectDetails: string;
}
