import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Doctor } from 'src/modules/doctors/entities/doctors.entities';
import { User } from 'src/modules/user/entities/user.entities';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Doctor, doctor => doctor.id)
    doctor: Doctor;

    @ManyToOne(() => User, user => user.id)
    patient: User;

    @Column({ type: 'date' })
    appointmentDate: string; // Solo la fecha (YYYY-MM-DD)

    @Column({ type: 'time' })
    appointmentTime: string; // Solo la hora (HH:MM:SS)

    @Column()
    reason: string;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;
}
