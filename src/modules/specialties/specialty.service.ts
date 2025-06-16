import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Specialty } from "./entities/specialty.entity";
import { CreateSpecialtyDto } from "./dto/create-specialty";


@Injectable()
export class SpecialtyService {

    constructor(
        @InjectRepository(Specialty)
        private readonly specialtyRepository: Repository<Specialty>
    ) { }

    create(dto: CreateSpecialtyDto) {
        const specialty = this.specialtyRepository.create(dto)
        return this.specialtyRepository.save(specialty)
    }

    findAllSpecialty() {
        return this.specialtyRepository.find({ relations: ['doctors', 'doctors.profileImage'] })
    }

    findOne(id: string) {
        return this.specialtyRepository.findOne({ where: { id }, relations: ['doctors'] })
    }

    async removeSpecialty(id: string) {
        const specialty = await this.findOne(id);
        return this.specialtyRepository.remove(specialty);
    }

}