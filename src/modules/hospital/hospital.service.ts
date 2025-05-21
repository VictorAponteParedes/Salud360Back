import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { CreateHospitalDto } from "./dto/create-hospital.dto";
import { File } from "../file-upload/entities/file.entity";
import { FileService } from "../file-upload/file.service";
import { Hospital } from "./entities/hospital.entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class HospitalService {
    constructor(
        @InjectRepository(Hospital)
        private hospitalRepository: Repository<Hospital>,

        @InjectRepository(File)
        private fileRepository: Repository<File>,
        private fileService: FileService
    ) {}

    async createHospital(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
        try {
            const { hospitaImageId, ...rest } = createHospitalDto;
            let hospitaImage: File | undefined;

            if (hospitaImageId) {
                hospitaImage = await this.fileRepository.findOneBy({ id: hospitaImageId });
                if (!hospitaImage) {
                    throw new NotFoundException('Imagen no encontrada');
                }
            }

            const hospital = this.hospitalRepository.create({
                ...rest,
                hospitaImage,
            });

            return await this.hospitalRepository.save(hospital);
        } catch (e) {
            throw new ConflictException('Error al crear hospital');
        }
    }

    async findAll(): Promise<Hospital[]> {
        return this.hospitalRepository.find({ relations: ['hospitaImage', 'doctors', 'patients'] });
    }

    async findById(id: string): Promise<Hospital | null> {
        return this.hospitalRepository.findOne({
            where: { id },
            relations: ['hospitaImage', 'doctors', 'patients'],
        });
    }

    async remove(id: string): Promise<void> {
        const hospital = await this.hospitalRepository.findOneBy({ id });
        if (!hospital) throw new NotFoundException('Hospital no encontrado');
        await this.hospitalRepository.remove(hospital);
    }
}