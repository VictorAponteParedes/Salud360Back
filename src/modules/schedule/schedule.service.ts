import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find();
  }

  findByDoctorId(doctorId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { doctor: { id: doctorId } },
    });
  }

  create(schedule: Partial<Schedule>): Promise<Schedule> {
    const newSchedule = this.scheduleRepository.create(schedule);
    return this.scheduleRepository.save(newSchedule);
  }

  async update(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    await this.scheduleRepository.update(id, schedule);
    return this.scheduleRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
