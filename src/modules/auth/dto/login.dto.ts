import { IsEmail, IsString, MinLength } from '@nestjs/class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}