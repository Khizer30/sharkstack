import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsArray } from "class-validator";
import { Trim } from "@common/transformer";

export class CreatePackageDto {
  @IsString({ message: "Slug must be a string" })
  @IsNotEmpty({ message: "Slug is required" })
  @Trim()
  slug: string;

  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  @Trim()
  title: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  @Trim()
  description: string;

  @IsArray({ message: "Features must be an array of strings" })
  @IsString({ each: true, message: "Each feature must be a string" })
  @IsOptional()
  features?: string[];

  @IsInt({ message: "Price cents must be an integer" })
  @IsOptional()
  priceCents?: number;

  @IsBoolean({ message: "isActive must be a boolean" })
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePackageDto {
  @IsString({ message: "Slug must be a string" })
  @IsOptional()
  @Trim()
  slug?: string;

  @IsString({ message: "Title must be a string" })
  @IsOptional()
  @Trim()
  title?: string;

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  @Trim()
  description?: string;

  @IsArray({ message: "Features must be an array of strings" })
  @IsString({ each: true, message: "Each feature must be a string" })
  @IsOptional()
  features?: string[];

  @IsInt({ message: "Price cents must be an integer" })
  @IsOptional()
  priceCents?: number;

  @IsBoolean({ message: "isActive must be a boolean" })
  @IsOptional()
  isActive?: boolean;
}
