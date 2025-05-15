// src/modules/lenguages/lenguaje.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LenguageController } from './lenguage.controller';
import { LenguageService } from './lenguage.service';
import { Lenguages } from './entities/lenguages.entities';

@Module({
    imports: [TypeOrmModule.forFeature([Lenguages])],
    controllers: [LenguageController],
    providers: [LenguageService],
    exports: [TypeOrmModule],
})
export class LenguageModule { }
