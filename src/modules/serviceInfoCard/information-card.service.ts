import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformationCard } from './entities/service-information-card.entities';
import { CreateInformationCardDto } from './dto/create-information-card.dto';
import { UpdateInformationCardDto } from './dto/update-information-card.dto';
import { FileService } from '../file-upload/file.service';
import { File } from '../file-upload/entities/file.entity';

@Injectable()
export class InformationCardService {
    constructor(
        @InjectRepository(InformationCard)
        private cardRepository: Repository<InformationCard>,

        @InjectRepository(File)
        private fileRepository: Repository<File>,
        private fileService: FileService
    ) { }

    async create(dto: CreateInformationCardDto, file?: Express.Multer.File): Promise<InformationCard> {
        try {
            const { serviceImageId, ...data } = dto;

            let serviceImage: File | undefined;

            if (serviceImageId) {
                serviceImage = await this.fileRepository.findOneBy({ id: serviceImageId });
                if (!serviceImage) {
                    throw new NotFoundException('La imagen referenciada no existe.');
                }
            }

            else if (file) {
                serviceImage = await this.fileService.saveFile(file);
            }

            const card = this.cardRepository.create({
                ...data,
                serviceImage,
            });

            return await this.cardRepository.save(card);
        } catch (error) {
            console.error(error);

            throw new InternalServerErrorException('Error al crear la tarjeta informativa.');
        }
    }

    async findAll() {
        try {
            return await this.cardRepository.find({
                relations: ['serviceImage'],
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las tarjetas informativas.');
        }
    }

    async findOne(id: string) {
        try {
            const card = await this.cardRepository.findOne({
                where: { id },
                relations: ['serviceImage'],
            });

            if (!card) {
                throw new NotFoundException(`No se encontró la tarjeta informativa con ID: ${id}`);
            }

            return card;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la tarjeta informativa.');
        }
    }

    async update(id: string, dto: UpdateInformationCardDto) {
        try {
            const { serviceImageId, ...rest } = dto;

            const updatePayload: any = {
                ...rest,
            };

            if (serviceImageId) {
                updatePayload.serviceImage = { id: serviceImageId };
            }

            const result = await this.cardRepository.update(id, updatePayload);

            if (result.affected === 0) {
                throw new NotFoundException(`No se encontró la tarjeta informativa con ID: ${id}`);
            }

            return { message: 'Tarjeta informativa actualizada correctamente.' };
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la tarjeta informativa.');
        }
    }


    async remove(id: string) {
        try {
            const result = await this.cardRepository.delete(id);

            if (result.affected === 0) {
                throw new NotFoundException(`No se encontró la tarjeta informativa con ID: ${id}`);
            }

            return { message: 'Tarjeta informativa eliminada correctamente.' };
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la tarjeta informativa.');
        }
    }

    async findAllActive() {
        try {
            return await this.cardRepository.find({
                where: { isActive: true },
                relations: ['serviceImage'],
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las tarjetas activas.');
        }
    }

    async setActiveStatus(id: string, status: boolean) {
        try {
            const result = await this.cardRepository.update(id, { isActive: status });

            if (result.affected === 0) {
                throw new NotFoundException(`No se encontró la tarjeta informativa con ID: ${id}`);
            }

            return {
                message: `Tarjeta informativa ${status ? 'activada' : 'desactivada'} correctamente.`,
            };
        } catch (error) {
            throw new InternalServerErrorException('Error al cambiar el estado de la tarjeta.');
        }
    }

}
