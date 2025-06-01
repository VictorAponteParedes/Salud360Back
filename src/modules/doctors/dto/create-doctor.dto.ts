import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal } from '@nestjs/class-validator';


export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsDecimal()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviews?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  specialtyIds: string[];

  @IsArray()
  languageIds: string[];

  @IsOptional()
  @IsArray()
  patientIds?: number[];

  @IsOptional()
  @IsString()
  hospitalId?: string[];


  @IsOptional()
  @IsString()
  profileImageId?: string;
}