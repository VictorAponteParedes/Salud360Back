import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Specialty } from '../../specialties/entities/specialty.entity';
import { Lenguages } from 'src/modules/lenguages/entities/lenguages.entities';
import { User } from 'src/modules/user/entities/user.entities';
import { Hospital } from 'src/modules/hospital/entities/hospital.entities';
import { File } from 'src/modules/file-upload/entities/file.entity';


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
    schedule: string;

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


    @ManyToMany(() => Lenguages, lenguage => lenguage.doctors)
    @JoinTable()
    languages: Lenguages[];

    @ManyToMany(() => User, user => user.doctors)
    @JoinTable()
    patients: User[];

    @ManyToOne(() => Hospital, hospital => hospital.doctors, { nullable: true })
    hospital: Hospital;


    get fullName(): string {
        return `Dr. ${this.firstName} ${this.lastName}`;
    }
}