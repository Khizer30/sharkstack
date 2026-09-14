import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";
import { Trim } from "@common/transformer";

export class CreateTeamMemberDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @Trim()
  name: string;

  @IsString({ message: "Social link must be a string" })
  @IsUrl({}, { message: "Social link must be a valid URL" })
  @IsOptional()
  @Trim()
  socialLink?: string;

  @IsString({ message: "Job title must be a string" })
  @IsNotEmpty({ message: "Job title is required" })
  @Trim()
  jobTitle: string;

  @IsString({ message: "Review must be a string" })
  @IsNotEmpty({ message: "Review is required" })
  @Trim()
  review: string;
}
