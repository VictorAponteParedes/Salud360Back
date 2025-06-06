import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entities';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Doctor } from '../doctors/entities/doctors.entities';
import { User } from '../user/entities/user.entities';

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, Doctor, User])],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule { }
