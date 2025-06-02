import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctor.controller';


import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguage } from '../lenguages/entities/lenguages.entities';
import { User } from '../user/entities/user.entities';
import { File } from '../file-upload/entities/file.entity';
import { Hospital } from '../hospital/entities/hospital.entities';
import { Schedule } from '../schedule/entities/schedule.entity';


//Services
import { FileService } from '../file-upload/file.service';
import { HospitalService } from '../hospital/hospital.service';
import { LenguageService } from '../lenguages/lenguage.service';
import { SpecialtyService } from '../specialties/specialty.service';
import { DoctorsService } from './doctor.service';
import { ScheduleService } from '../schedule/schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialty, Lenguage, User, File, Hospital, Schedule]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, FileService, HospitalService, LenguageService, SpecialtyService, ScheduleService],
  exports: [DoctorsService],
})
export class DoctorsModule { }