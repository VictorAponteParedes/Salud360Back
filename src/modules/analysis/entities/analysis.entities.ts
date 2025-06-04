import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entities';

@Entity()
export class Analysis {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string; 

    @Column({ type: 'date' })
    analysisDate: Date; 

    @Column({ type: 'text', nullable: true })
    results: string; 

    @Column({ nullable: true })
    labName: string; 

    @Column({ nullable: true })
    fileUrl: string; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

 
    @ManyToOne(() => User, (user) => user.analyses)
    @JoinColumn({ name: 'patientId' })
    patient: User;

    @Column()
    patientId: string;
}