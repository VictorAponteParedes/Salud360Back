import { Doctor } from 'src/modules/doctors/entities/doctors.entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { File } from 'src/modules/file-upload/entities/file.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ type: 'date' })
    dateBirth: Date;

    @Column({ nullable: true })
    bloodType: string;

    @Column({ type: 'text', nullable: true })
    allergies: string;
    @Column()
    contactEmergency: string;

    @Column()
    password: string;

    @Column({ default: 'patient' })
    role: string;

    @ManyToMany(() => Doctor, doctor => doctor.patients)
    doctors: Doctor[];

    @ManyToOne(() => File, { nullable: true })
    @JoinColumn()
    profileImage: File;

}