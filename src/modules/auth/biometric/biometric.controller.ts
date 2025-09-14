import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BiometricService } from './biometric.service';

@Controller('auth/biometric')
export class BiometricController {
    constructor(private readonly biometricService: BiometricService) { }

    @Post('challenge')
    async generateChallenge(@Body('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email es requerido');
        }
        return this.biometricService.generateChallenge(email);
    }

    @Post('register')
    async registerBiometric(
        @Body('email') email: string,
        @Body('publicKey') publicKey: string,
    ) {
        if (!email || !publicKey) {
            throw new BadRequestException('Email y publicKey son requeridos');
        }
        return this.biometricService.registerBiometric(email, publicKey);
    }

    @Post('login')
    async biometricLogin(
        @Body('email') email: string,
        @Body('challengeId') challengeId: string,
        @Body('signature') signature: string,
    ) {
        if (!email || !challengeId || !signature) {
            throw new BadRequestException('Email, challengeId y signature son requeridos');
        }
        return this.biometricService.verifyBiometricLogin(email, challengeId, signature);
    }
}