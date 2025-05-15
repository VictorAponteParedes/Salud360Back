// src/modules/specialties/dto/create-specialty.dto.ts
import { IsString, IsOptional } from '@nestjs/class-validator';

export class CreateSpecialtyDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
