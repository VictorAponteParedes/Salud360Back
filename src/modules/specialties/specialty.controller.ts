import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty';

@Controller('specialties')
export class SpecialtyController {
    constructor(private readonly specialtyService: SpecialtyService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateSpecialtyDto) {
        try {
            if (!dto || Object.keys(dto).length === 0) {
                throw new BadRequestException('Specialty data is required');
            }

            const specialty = await this.specialtyService.create(dto);
            return {
                message: 'Specialty created successfully',
                data: specialty,
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while creating the specialty');
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        try {
            const specialties = await this.specialtyService.findAllSpecialty();
            return {
                message: 'Specialties retrieved successfully',
                data: specialties,
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while retrieving specialties');
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string) {
        try {
            const specialty = await this.specialtyService.findOne(id);
            if (!specialty) {
                throw new NotFoundException(`Specialty with ID ${id} not found`);
            }

            return {
                message: 'Specialty retrieved successfully',
                data: specialty,
            };
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        try {
            const specialty = await this.specialtyService.findOne(id);
            if (!specialty) {
                throw new NotFoundException(`Specialty with ID ${id} not found`);
            }

            await this.specialtyService.removeSpecialty(id);
            return {
                message: 'Specialty deleted successfully',
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while deleting the specialty');
        }
    }
}
