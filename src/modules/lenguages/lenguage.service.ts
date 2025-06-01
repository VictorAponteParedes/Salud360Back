// src/modules/lenguages/lenguage.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lenguage } from './entities/lenguages.entities';
import { CreateLenguageDto } from './dto/create-lenguage.dto';

@Injectable()
export class LenguageService {
    constructor(
        @InjectRepository(Lenguage)
        private readonly lenguageRepository: Repository<Lenguage>,
    ) { }

    async create(createLenguageDto: CreateLenguageDto): Promise<Lenguage> {
        const newLenguage = this.lenguageRepository.create(createLenguageDto);
        return await this.lenguageRepository.save(newLenguage);
    }

    async findAll(): Promise<Lenguage[]> {
        return this.lenguageRepository.find();
    }

    async findOne(id: string): Promise<Lenguage> {
        return this.lenguageRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.lenguageRepository.delete(id);
    }
}
