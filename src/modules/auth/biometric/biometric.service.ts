import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createPublicKey, verify } from 'crypto';
import { User } from 'src/modules/user/entities/user.entities';
import { BiometricChallenge } from 'src/modules/user/entities/biometric-challenge.entity';
import { JwtService } from '@nestjs/jwt'; // NUEVO: Para generar access_token

@Injectable()
export class BiometricService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(BiometricChallenge)
        private challengeRepository: Repository<BiometricChallenge>,
        private jwtService: JwtService, // NUEVO: Inyectar JwtService
    ) { }

    async generateChallenge(email: string) {
        console.log(`[BiometricService] Generando challenge para email: ${email}`);
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            console.log(`[BiometricService] Usuario no encontrado: ${email}`);
            throw new BadRequestException('Usuario no encontrado');
        }

        const challenge = uuidv4();
        const challengeEntity = this.challengeRepository.create({
            userId: user.id,
            challenge,
            used: false,
        });
        await this.challengeRepository.save(challengeEntity);
        console.log(`[BiometricService] Challenge generado: ${challengeEntity.id}, challenge: ${challenge}`);

        return { challengeId: challengeEntity.id, challenge };
    }

    async registerBiometric(email: string, publicKey: string) {
        console.log(`[BiometricService] Registrando clave biométrica para email: ${email}`);
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            console.log(`[BiometricService] Usuario no encontrado: ${email}`);
            throw new BadRequestException('Usuario no encontrado');
        }

        user.biometricPublicKey = publicKey;
        await this.userRepository.save(user);
        console.log(`[BiometricService] Clave biométrica registrada para usuario: ${user.id}`);

        return { message: 'Clave biométrica registrada exitosamente' };
    }

    async verifyBiometricLogin(email: string, challengeId: string, signature: string) {
        console.log(`[BiometricService] Verificando login biométrico para email: ${email}, challengeId: ${challengeId}`);
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !user.biometricPublicKey) {
            console.log(`[BiometricService] Usuario no encontrado o sin clave biométrica: ${email}`);
            throw new BadRequestException('Usuario no encontrado o sin clave biométrica registrada');
        }

        const challengeEntity = await this.challengeRepository.findOne({ where: { id: challengeId } });
        if (!challengeEntity || challengeEntity.used) {
            console.log(`[BiometricService] Challenge inválido o ya usado: ${challengeId}, used: ${challengeEntity?.used}`);
            throw new BadRequestException('Challenge inválido o ya usado');
        }

        // Verificar tiempo de expiración (5 minutos)
        const now = new Date();
        const challengeAge = (now.getTime() - challengeEntity.createdAt.getTime()) / 1000 / 60;
        if (challengeAge > 5) {
            console.log(`[BiometricService] Challenge expirado: ${challengeId}, edad: ${challengeAge} minutos`);
            throw new BadRequestException('Challenge expirado');
        }

        // Verificar la firma
        try {
            const publicKey = createPublicKey({
                key: Buffer.from(user.biometricPublicKey, 'base64'),
                format: 'der',
                type: 'spki',
            });

            const verifier = verify(
                'sha256',
                Buffer.from(challengeEntity.challenge),
                publicKey,
                Buffer.from(signature, 'base64'),
            );

            if (!verifier) {
                console.log(`[BiometricService] Firma inválida para challenge: ${challengeId}`);
                throw new UnauthorizedException('Firma inválida');
            }

            // Marcar el challenge como usado solo después de una verificación exitosa
            challengeEntity.used = true;
            await this.challengeRepository.save(challengeEntity);
            console.log(`[BiometricService] Challenge marcado como usado: ${challengeId}`);

            // Generar access_token y devolver usuario completo
            const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
            console.log(`[BiometricService] Login biométrico exitoso para usuario: ${user.id}, token generado`);

            return {
                access_token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        } catch (error) {
            console.log(`[BiometricService] Error al verificar la firma: ${error.message}`);
            throw new UnauthorizedException('Error al verificar la firma: ' + error.message);
        }
    }
}