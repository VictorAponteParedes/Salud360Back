import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entities';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { File } from '../file-upload/entities/file.entity';
import { FileService } from '../file-upload/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, File])],
  providers: [HospitalService, FileService],
  controllers: [HospitalController],
  exports: [HospitalService],
})
export class HospitalModule {}