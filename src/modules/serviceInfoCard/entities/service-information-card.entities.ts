import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { File } from 'src/modules/file-upload/entities/file.entity';


@Entity('information_cards')
export class InformationCard {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @OneToOne(() => File, { nullable: true })
    @JoinColumn()
    serviceImage: File;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    screen: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
