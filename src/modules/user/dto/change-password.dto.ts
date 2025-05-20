import {IsString, MinLength} from '@nestjs/class-validator'


export class ChangePasswordDto {

@IsString()
currentPassword: string;

@IsString()
@MinLength(6)
newPassword: string;
}