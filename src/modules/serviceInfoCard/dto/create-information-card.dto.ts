import { IsString, IsOptional } from 'class-validator';

export class CreateInformationCardDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    serviceImageId?: string;

    @IsOptional()
    @IsString()
    screen?: string;
}
