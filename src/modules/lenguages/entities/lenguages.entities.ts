import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Doctor } from "src/modules/doctors/entities/doctors.entities";

@Entity()
export class Lenguages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Doctor, doctor => doctor.languages)
    doctors: Doctor[];



}