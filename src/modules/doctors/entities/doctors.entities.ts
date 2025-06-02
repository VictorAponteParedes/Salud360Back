import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Specialty } from '../../specialties/entities/specialty.entity';
import { Lenguage } from 'src/modules/lenguages/entities/lenguages.entities';
import { User } from 'src/modules/user/entities/user.entities';
import { Hospital } from 'src/modules/hospital/entities/hospital.entities';
import { File } from 'src/modules/file-upload/entities/file.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';


@Entity()
export class Doctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
    rating: number;

    @Column({ default: 0 })
    reviews: number;

    @Column({ type: 'enum', enum: ['available', 'unavailable', 'on_leave'], default: 'available' })
    status: string;

    @Column({ nullable: true })
    experience: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToOne(() => File, { nullable: true })
    @JoinColumn()
    profileImage: File;

    @ManyToMany(() => Specialty, specialty => specialty.doctors)
    @JoinTable()
    specialties: Specialty[];


    @ManyToMany(() => Lenguage, lenguage => lenguage.doctors)
    @JoinTable()
    languages: Lenguage[];

    @ManyToMany(() => User, user => user.doctors)
    @JoinTable()
    patients: User[];

    @ManyToMany(() => Hospital, hospital => hospital.doctors, { nullable: true })
    @JoinTable()
    hospitals: Hospital[];

    @OneToMany(() => Schedule, schedule => schedule.doctor, {
        cascade: true, 
        eager: true,   
    })
  schedules: Schedule[];


    get fullName(): string {
        return `Dr. ${this.firstName} ${this.lastName}`;
    }
}