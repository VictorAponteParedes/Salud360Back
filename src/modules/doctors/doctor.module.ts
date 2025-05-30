import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctor.controller';
import { DoctorsService } from './doctor.service';
import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguages } from '../lenguages/entities/lenguages.entities';
import { User } from '../user/entities/user.entities';
import { FileService } from '../file-upload/file.service';
import { File } from '../file-upload/entities/file.entity';
import { Hospital } from '../hospital/entities/hospital.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialty, Lenguages, User, File, Hospital]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, FileService],
  exports: [DoctorsService],
})
export class DoctorsModule { }