// schedule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WeekDay } from '../enum/weekDay';
import { Doctor } from '../../doctors/entities/doctors.entities';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: WeekDay })
  day: WeekDay;

  @Column()
  startTime: string; 
  @Column()
  endTime: string;

  @ManyToOne(() => Doctor, doctor => doctor.schedules, { onDelete: 'CASCADE' })
  doctor: Doctor;
}
