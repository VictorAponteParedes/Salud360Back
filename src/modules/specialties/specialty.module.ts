// src/modules/specialties/specialty.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Specialty])],
    controllers: [SpecialtyController],
    providers: [SpecialtyService],
    exports: [SpecialtyService],
})
export class SpecialtyModule { }
