import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entities';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Doctor } from '../doctors/entities/doctors.entities';
import { User } from '../user/entities/user.entities';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,

        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        try {
            const { doctorId, patientId, appointmentDate, reason, notes } = createAppointmentDto;

            const doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
            if (!doctor) {
                throw new NotFoundException(`Doctor con ID ${doctorId} no encontrado`);
            }

            const patient = await this.userRepository.findOne({ where: { id: patientId } });
            if (!patient) {
                throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
            }

            const appointment = this.appointmentRepository.create({
                doctor,
                patient,
                appointmentDate: new Date(appointmentDate),
                reason,
                notes,
            });

            return await this.appointmentRepository.save(appointment);
        } catch (error) {
            console.error('Error al crear la cita:', error);
            throw new InternalServerErrorException('No se pudo crear la cita');
        }
    }
}
