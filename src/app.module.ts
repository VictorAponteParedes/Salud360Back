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
import { HospitalModule } from './modules/hospital/hospital.module';
import { AnalysisModule } from './modules/analysis/analysis.module';

// Entities
import { User } from './modules/user/entities/user.entities';
import { Doctor } from './modules/doctors/entities/doctors.entities';
import { Specialty } from './modules/specialties/entities/specialty.entity';
import { Lenguage } from './modules/lenguages/entities/lenguages.entities';
import { File } from './modules/file-upload/entities/file.entity';
import { Hospital } from './modules/hospital/entities/hospital.entities';
import { Schedule } from './modules/schedule/entities/schedule.entity';
import { Analysis } from './modules/analysis/entities/analysis.entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Doctor, Specialty, Lenguage, File, Hospital, Schedule, Analysis],
      synchronize: true,

      // ssl: true,
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false  // Necesario para la conexión SSL
      //   }
      // }
    }),
    UserModule,
    AuthModule,
    LenguageModule,
    SpecialtyModule,
    DoctorsModule,
    UploadModule,
    HospitalModule,
    AnalysisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }