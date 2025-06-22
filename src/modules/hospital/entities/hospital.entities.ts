import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToMany } from "typeorm";
import { Doctor } from "../../doctors/entities/doctors.entities";
import { User } from "../../user/entities/user.entities";
import { File } from "src/modules/file-upload/entities/file.entity";

@Entity()
export class Hospital {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    website: string;

    @OneToOne(() => File, { nullable: true })
    @JoinColumn()
    hospitalImage: File;

    @ManyToMany(() => Doctor, doctor => doctor.hospitals)
    doctors: Doctor[];

    @OneToMany(() => User, user => user.hospital)
    patients: User[];

    @Column({ default: true })
    status: boolean;

    @Column("decimal", { precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column("decimal", { precision: 10, scale: 6, nullable: true })
    longitude: number;
}
