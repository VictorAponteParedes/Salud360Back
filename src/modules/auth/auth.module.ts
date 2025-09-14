import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { BiometricController } from './biometric/biometric.controller';
import { BiometricService } from './biometric/biometric.service';
import { User } from '../user/entities/user.entities';
import { BiometricChallenge } from '../user/entities/biometric-challenge.entity';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        PassportModule,
        BiometricChallenge,
        User,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET no está definido en las variables de entorno');
                }
                return {
                    secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, BiometricService],
    controllers: [AuthController, BiometricController],
})
export class AuthModule { }