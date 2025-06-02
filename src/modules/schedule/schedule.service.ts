import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    try {
      const schedules = await this.scheduleRepository.find();
      return schedules;
    } catch (error) {
      throw new BadRequestException('Error al obtener los horarios');
    }
  }

  async findByDoctorId(doctorId: string): Promise<Schedule[]> {
    try {
      if (!doctorId) {
        throw new BadRequestException('El ID del doctor es requerido');
      }
      const schedules = await this.scheduleRepository.find({
        where: { doctor: { id: doctorId } },
      });
      return schedules;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener los horarios del doctor');
    }
  }

  async create(schedule: Partial<Schedule>): Promise<Schedule> {
    try {
      if (!schedule.day || !schedule.startTime || !schedule.endTime || !schedule.doctor) {
        throw new BadRequestException('Faltan datos requeridos para crear el horario');
      }
      const newSchedule = this.scheduleRepository.create(schedule);
      const savedSchedule = await this.scheduleRepository.save(newSchedule);
      return savedSchedule;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el horario');
    }
  }

  async update(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    try {
      if (!id) {
        throw new BadRequestException('El ID del horario es requerido');
      }
      const existingSchedule = await this.scheduleRepository.findOneBy({ id });
      if (!existingSchedule) {
        throw new NotFoundException(`Horario con ID ${id} no encontrado`);
      }
      await this.scheduleRepository.update(id, schedule);
      const updatedSchedule = await this.scheduleRepository.findOneBy({ id });
      return updatedSchedule;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el horario');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      if (!id) {
        throw new BadRequestException('El ID del horario es requerido');
      }
      const existingSchedule = await this.scheduleRepository.findOneBy({ id });
      if (!existingSchedule) {
        throw new NotFoundException(`Horario con ID ${id} no encontrado`);
      }
      await this.scheduleRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el horario');
    }
  }
}