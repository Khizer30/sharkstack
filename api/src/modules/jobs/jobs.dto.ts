import { IsString, IsNotEmpty, IsArray, IsIn, IsOptional } from "class-validator";
import { Trim } from "@common/transformer";
import { jobDepartmentEnum, workNatureEnum, jobTypeEnum, type JobDepartment, type WorkNature, type JobType } from "@models/jobs";

export class CreateJobDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  @Trim()
  title: string;

  @IsIn(jobDepartmentEnum.enumValues, {
    message: `Department must be one of: ${jobDepartmentEnum.enumValues.join(", ")}`
  })
  department: JobDepartment;

  @IsIn(workNatureEnum.enumValues, {
    message: `Work nature must be one of: ${workNatureEnum.enumValues.join(", ")}`
  })
  workNature: WorkNature;

  @IsIn(jobTypeEnum.enumValues, {
    message: `Job type must be one of: ${jobTypeEnum.enumValues.join(", ")}`
  })
  type: JobType;

  @IsString({ message: "Responsibilities must be a string" })
  @IsNotEmpty({ message: "Responsibilities is required" })
  @Trim()
  responsibilities: string;

  @IsString({ message: "Requirements must be a string" })
  @IsNotEmpty({ message: "Requirements is required" })
  @Trim()
  requirements: string;

  @IsArray({ message: "Benefits must be an array of strings" })
  @IsString({ each: true, message: "Each benefit must be a string" })
  benefits: string[];

  @IsArray({ message: "Skills must be an array of strings" })
  @IsString({ each: true, message: "Each skill must be a string" })
  skills: string[];

  @IsArray({ message: "Additional skills must be an array of strings" })
  @IsString({ each: true, message: "Each additional skill must be a string" })
  additionalSkills: string[];
}

export class UpdateJobDto {
  @IsString({ message: "Title must be a string" })
  @IsOptional()
  @Trim()
  title?: string;

  @IsIn(jobDepartmentEnum.enumValues, {
    message: `Department must be one of: ${jobDepartmentEnum.enumValues.join(", ")}`
  })
  @IsOptional()
  department?: JobDepartment;

  @IsIn(workNatureEnum.enumValues, {
    message: `Work nature must be one of: ${workNatureEnum.enumValues.join(", ")}`
  })
  @IsOptional()
  workNature?: WorkNature;

  @IsIn(jobTypeEnum.enumValues, {
    message: `Job type must be one of: ${jobTypeEnum.enumValues.join(", ")}`
  })
  @IsOptional()
  type?: JobType;

  @IsString({ message: "Responsibilities must be a string" })
  @IsOptional()
  @Trim()
  responsibilities?: string;

  @IsString({ message: "Requirements must be a string" })
  @IsOptional()
  @Trim()
  requirements?: string;

  @IsArray({ message: "Benefits must be an array of strings" })
  @IsString({ each: true, message: "Each benefit must be a string" })
  @IsOptional()
  benefits?: string[];

  @IsArray({ message: "Skills must be an array of strings" })
  @IsString({ each: true, message: "Each skill must be a string" })
  @IsOptional()
  skills?: string[];

  @IsArray({ message: "Additional skills must be an array of strings" })
  @IsString({ each: true, message: "Each additional skill must be a string" })
  @IsOptional()
  additionalSkills?: string[];
}
