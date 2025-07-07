import { Doctor } from 'src/modules/doctors/entities/doctors.entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { File } from 'src/modules/file-upload/entities/file.entity';
import { Hospital } from 'src/modules/hospital/entities/hospital.entities';
import { Analysis } from 'src/modules/analysis/entities/analysis.entities';
import { UserRole } from 'src/enum/userRol';

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

    @Column({ unique: true, nullable: true })
    documentNumber: string;

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

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
    })
    role: UserRole

    @ManyToMany(() => Doctor, doctor => doctor.patients)
    doctors: Doctor[];

    @OneToOne(() => File, { nullable: true })
    @JoinColumn()
    profileImage: File;

    @ManyToOne(() => Hospital, hospital => hospital.patients, { nullable: true })
    @JoinColumn({ name: 'hospitalId' })
    hospital: Hospital;

    @OneToMany(() => Analysis, (analysis) => analysis.patient)
    analyses: Analysis[];
}