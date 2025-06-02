import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getAll(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string): Promise<Schedule[]> {
    return this.scheduleService.findByDoctorId(doctorId);
  }

  @Post()
  create(@Body() scheduleData: Partial<Schedule>): Promise<Schedule> {
    return this.scheduleService.create(scheduleData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() scheduleData: Partial<Schedule>): Promise<Schedule> {
    return this.scheduleService.update(id, scheduleData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.scheduleService.remove(id);
  }
}
