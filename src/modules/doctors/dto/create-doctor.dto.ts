import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber, IsDecimal, ValidateNested } from '@nestjs/class-validator';
import { ScheduleDto } from 'src/modules/schedule/dto/create-schedule.dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  scheduleDtos?: ScheduleDto[];
}