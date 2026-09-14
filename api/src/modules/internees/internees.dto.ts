import { IsString, IsNotEmpty, IsEmail, Matches, IsOptional } from "class-validator";
import { Trim, Lowercase } from "@common/transformer";

export class CreateInterneeDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Trim()
  name: string;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  @Trim()
  @Lowercase()
  email: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^\+?[\d ]+$/, { message: "Phone number must contain only digits and spaces, and optionally start with +" })
  @Trim()
  phone: string;

  @IsString({ message: "About must be a string" })
  @IsNotEmpty({ message: "About is required" })
  @Trim()
  about: string;

  @IsOptional()
  resume?: Express.Multer.File;
}
