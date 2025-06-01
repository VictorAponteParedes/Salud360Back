// src/modules/lenguages/lenguaje.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LenguageController } from './lenguage.controller';
import { LenguageService } from './lenguage.service';
import { Lenguage } from './entities/lenguages.entities';

@Module({
    imports: [TypeOrmModule.forFeature([Lenguage])],
    controllers: [LenguageController],
    providers: [LenguageService],
    exports: [TypeOrmModule],
})
export class LenguageModule { }
