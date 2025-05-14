import { IsEmail, IsString, MinLength, IsDateString, IsOptional } from '@nestjs/class-validator';

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsDateString()
    dateBirth: Date;

    @IsString()
    @IsOptional()
    bloodType?: string;

    @IsString()
    @IsOptional()
    allergies?: string;

    @IsString()
    contactEmergency: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    confirmPassword: string;
}