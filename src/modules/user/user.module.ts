import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entities';
import { File } from '../file-upload/entities/file.entity';
import { BiometricChallenge } from './entities/biometric-challenge.entity';
import { FileService } from '../file-upload/file.service';
import { UploadModule } from '../file-upload/file.module';
import { EmailService } from '../Email/email.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, File, BiometricChallenge]), UploadModule],
    providers: [UserService, FileService, EmailService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule], // Exportamos TypeOrmModule para los repositorios
})
export class UserModule { }