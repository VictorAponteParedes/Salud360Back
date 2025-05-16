// src/modules/specialties/entities/specialty.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Doctor } from 'src/modules/doctors/entities/doctors.entities';


@Entity()
export class Specialty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Doctor, doctor => doctor.specialties)
    doctors: Doctor[];
}