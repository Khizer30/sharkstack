import { IsString, IsNotEmpty, IsEmail, Matches, IsOptional } from "class-validator";
import { Trim, Lowercase } from "@common/transformer";

export class CreateApplicantDto {
  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @Trim()
  firstName: string;

  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @Trim()
  lastName: string;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @Trim()
  @Lowercase()
  email: string;

  @IsString({ message: "City must be a string" })
  @IsNotEmpty({ message: "City is required" })
  @Trim()
  city: string;

  @IsString({ message: "State must be a string" })
  @IsNotEmpty({ message: "State is required" })
  @Trim()
  state: string;

  @IsString({ message: "Phone must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^\+?[\d ]+$/, { message: "Phone number must contain only digits and spaces, and optionally start with +" })
  @Trim()
  phone: string;

  @IsString({ message: "Job ID must be a string" })
  @IsOptional()
  @Trim()
  jobId?: string;
}
