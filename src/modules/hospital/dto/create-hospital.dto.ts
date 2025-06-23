import { IsString, IsOptional, IsEmail, IsBoolean } from '@nestjs/class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  hospitalImageId?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}