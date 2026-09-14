import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";
import { Trim, ToArray } from "@common/transformer";

export class CreatePortfolioDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  @Trim()
  title: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  @Trim()
  description: string;

  @IsString({ message: "Problem & Solution must be a string" })
  @IsNotEmpty({ message: "Problem & Solution is required" })
  @Trim()
  problemAndSolution: string;

  @IsString({ message: "Link must be a string" })
  @IsOptional()
  @Trim()
  link?: string;

  @ToArray()
  @IsArray({ message: "Technologies must be an array of strings" })
  @IsString({ each: true, message: "Each technology must be a string" })
  technologies: string[];

  @ToArray()
  @IsArray({ message: "Tools must be an array of strings" })
  @IsString({ each: true, message: "Each tool must be a string" })
  tools: string[];
}
