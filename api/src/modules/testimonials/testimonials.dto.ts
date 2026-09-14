import { IsString, IsNotEmpty } from "class-validator";
import { Trim } from "@common/transformer";

export class CreateTestimonialDto {
  @IsString({ message: "Client name must be a string" })
  @IsNotEmpty({ message: "Client name is required" })
  @Trim()
  clientName: string;

  @IsString({ message: "Company must be a string" })
  @IsNotEmpty({ message: "Company is required" })
  @Trim()
  company: string;

  @IsString({ message: "Review must be a string" })
  @IsNotEmpty({ message: "Review is required" })
  @Trim()
  review: string;
}
