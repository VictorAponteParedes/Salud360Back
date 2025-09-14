import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class BiometricChallenge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string; // Relacionado con el usuario

    @Column()
    challenge: string; // Challenge único

    @CreateDateColumn()
    createdAt: Date; // Para manejar expiración

    @Column({ default: false })
    used: boolean; // Indica si el challenge ya fue usado
}