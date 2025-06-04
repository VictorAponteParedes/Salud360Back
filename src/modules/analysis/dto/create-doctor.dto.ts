import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from '@nestjs/class-validator';

export class CreateAnalysisDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  analysisDate: Date;

  @IsOptional()
  @IsString()
  results?: string;

  @IsOptional()
  @IsString()
  labName?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsNotEmpty()
  @IsUUID()
  patientId: string;
}