import { IsEnum, IsString, IsUUID } from '@nestjs/class-validator';
import { WeekDay } from '../enum/weekDay';

export class ScheduleDto {
  @IsUUID()
  id?: string;

  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsUUID()
  doctorId: string;
}