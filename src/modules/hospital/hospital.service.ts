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
    ) { }

    async createHospital(createHospitalDto: CreateHospitalDto, profileImageFile?: Express.Multer.File): Promise<Hospital> {
        try {
            const { hospitalImageId, ...rest } = createHospitalDto;
            let hospitalImage: File | undefined;

            if (hospitalImageId) {
                hospitalImage = await this.fileRepository.findOneBy({ id: hospitalImageId });
                if (!hospitalImage) {
                    throw new NotFoundException('Imagen no encontrada');
                }
            }
            else if (profileImageFile) {
                hospitalImage = await this.fileService.saveFile(profileImageFile);
            }

            const hospital = this.hospitalRepository.create({
                ...rest,
                hospitalImage,
            });

            return await this.hospitalRepository.save(hospital);
        } catch (e) {
            throw new ConflictException('Error al crear hospital');
        }
    }


    async findAll(): Promise<Hospital[]> {
        return this.hospitalRepository.find({ relations: ['hospitalImage', 'doctors', 'patients'] });
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