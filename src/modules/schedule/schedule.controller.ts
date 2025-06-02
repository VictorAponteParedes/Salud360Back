import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { ScheduleDto } from './dto/create-schedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getAll(): Promise<Schedule[]> {
    try {
      const schedules = await this.scheduleService.findAll();
      return schedules;
    } catch (error) {
      throw new BadRequestException('Error al obtener los horarios');
    }
  }

  @Get('doctor/:doctorId')
  async getByDoctor(@Param('doctorId') doctorId: string): Promise<Schedule[]> {
    try {
      if (!doctorId) {
        throw new BadRequestException('El ID del doctor es requerido');
      }
      const schedules = await this.scheduleService.findByDoctorId(doctorId);
      return schedules;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener los horarios del doctor');
    }
  }

  @Post()
  async create(@Body() scheduleDto: ScheduleDto): Promise<Schedule> {
    try {
      const newSchedule = await this.scheduleService.create(scheduleDto);
      return newSchedule;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el horario');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() scheduleDto: ScheduleDto): Promise<Schedule> {
    try {
      if (!id) {
        throw new BadRequestException('El ID del horario es requerido');
      }
      const updatedSchedule = await this.scheduleService.update(id, scheduleDto);
      if (!updatedSchedule) {
        throw new NotFoundException(`Horario con ID ${id} no encontrado`);
      }
      return updatedSchedule;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el horario');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      if (!id) {
        throw new BadRequestException('El ID del horario es requerido');
      }
      await this.scheduleService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el horario');
    }
  }
}