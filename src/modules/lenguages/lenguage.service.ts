// src/modules/lenguages/lenguage.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lenguages } from './entities/lenguages.entities';
import { CreateLenguageDto } from './dto/create-lenguage.dto';

@Injectable()
export class LenguageService {
    constructor(
        @InjectRepository(Lenguages)
        private readonly lenguageRepository: Repository<Lenguages>,
    ) { }

    async create(createLenguageDto: CreateLenguageDto): Promise<Lenguages> {
        const newLenguage = this.lenguageRepository.create(createLenguageDto);
        return await this.lenguageRepository.save(newLenguage);
    }

    async findAll(): Promise<Lenguages[]> {
        return this.lenguageRepository.find();
    }

    async findOne(id: string): Promise<Lenguages> {
        return this.lenguageRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.lenguageRepository.delete(id);
    }
}
