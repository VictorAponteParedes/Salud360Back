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
            const {
                doctorId,
                patientId,
                appointmentDate,
                appointmentTime,
                reason,
                notes,
            } = createAppointmentDto;

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
                appointmentDate,
                appointmentTime,
                reason,
                notes,
            });

            return await this.appointmentRepository.save(appointment);
        } catch (error) {
            console.error('Error al crear la cita:', error);
            throw new InternalServerErrorException('No se pudo crear la cita');
        }
    }




    async findById(id: string): Promise<Appointment> {
        try {
            const appointment = await this.appointmentRepository.findOne({
                where: { id },
                relations: ['doctor', 'patient'],
            });

            if (!appointment) {
                throw new NotFoundException(`Cita con ID ${id} no encontrada`);
            }

            return appointment;
        } catch (error) {
            console.error('Error al obtener la cita por ID:', error);
            throw new InternalServerErrorException('No se pudo obtener la cita');
        }
    }

    async findByPatientId(patientId: string): Promise<Appointment[]> {
        try {
            const patient = await this.userRepository.findOne({ where: { id: patientId } });
            if (!patient) {
                throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
            }

            const appointments = await this.appointmentRepository.find({
                where: { patient: { id: patientId } },
                relations: ['doctor', 'doctor.profileImage', 'patient'],
                order: { appointmentDate: 'DESC' },
            });

            return appointments;
        } catch (error) {
            console.error('Error al obtener las citas del paciente:', error);
            throw new InternalServerErrorException('No se pudieron obtener las citas del paciente');
        }
    }



    async findAll(): Promise<Appointment[]> {
        try {
            return await this.appointmentRepository.find({
                relations: ['doctor', 'patient', 'doctor.profileImage'],
                order: { appointmentDate: 'DESC' },
            });
        } catch (error) {
            console.error('Error al obtener todas las citas:', error);
            throw new InternalServerErrorException('No se pudieron obtener las citas');
        }
    }
}
