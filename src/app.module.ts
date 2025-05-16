import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LenguageModule } from './modules/lenguages/lenguage.module';
import { SpecialtyModule } from './modules/specialties/specialty.module';
import { DoctorsModule } from './modules/doctors/doctor.module';
import { UploadModule } from './modules/file-upload/file.module';

// Entities
import { User } from './modules/user/entities/user.entities';
import { Doctor } from './modules/doctors/entities/doctors.entities';
import { Specialty } from './modules/specialties/entities/specialty.entity';
import { Lenguages } from './modules/lenguages/entities/lenguages.entities';
import { File } from './modules/file-upload/entities/file.entity';

@Module({
  imports: [
    // Configura ConfigModule primero
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que ConfigService esté disponible en todos los módulos
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: 'root',
      password: null,
      database: 'salud360_db',
      entities: [User, Doctor, Specialty, Lenguages, File],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    LenguageModule,
    SpecialtyModule,
    DoctorsModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }