import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctor.controller';
import { DoctorsService } from './doctor.service';
import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguages } from '../lenguages/entities/lenguages.entities';
import { User } from '../user/entities/user.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialty, Lenguages, User]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}