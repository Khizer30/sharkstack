import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Trim } from "@common/transformer";

export class SubheadingDto {
  @IsString({ message: "Subheading title must be a string" })
  @IsNotEmpty({ message: "Subheading title is required" })
  @Trim()
  title: string;

  @IsString({ message: "Subheading description must be a string" })
  @IsNotEmpty({ message: "Subheading description is required" })
  @Trim()
  description: string;
}

export class CreateServiceDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  @Trim()
  title: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  @Trim()
  description: string;

  @IsArray({ message: "Subheadings must be an array" })
  @ValidateNested({ each: true })
  @Type(() => SubheadingDto)
  subheadings: SubheadingDto[];
}
