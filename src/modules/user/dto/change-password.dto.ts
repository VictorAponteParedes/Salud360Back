import {IsString, MinLength} from '@nestjs/class-validator'


export class ChangePasswordDto {

@IsString()
currenPassword: string;

@IsString()
@MinLength(6)
newPassword: string;
}