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
import { LenguageService } from './lenguage.service';
import { CreateLenguageDto } from './dto/create-lenguage.dto';

@Controller('lenguages')
export class LenguageController {
    constructor(private readonly lenguageService: LenguageService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createLenguage(@Body() createLenguageDto: CreateLenguageDto) {
        try {
            if (!createLenguageDto || Object.keys(createLenguageDto).length === 0) {
                throw new BadRequestException('Lenguage data is required');
            }

            const newLenguage = await this.lenguageService.create(createLenguageDto);
            return {
                message: 'Lenguage created successfully',
                data: newLenguage,
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while creating the lenguage');
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllLenguages() {
        try {
            const lenguages = await this.lenguageService.findAll();
            return {
                message: 'Lenguages retrieved successfully',
                data: lenguages,
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while retrieving lenguages');
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findLenguageById(@Param('id') id: string) {
        try {
            const lenguage = await this.lenguageService.findOne(id);

            if (!lenguage) {
                throw new NotFoundException(`Lenguage with ID ${id} not found`);
            }

            return {
                message: 'Lenguage retrieved successfully',
                data: lenguage,
            };
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async removeLenguage(@Param('id') id: string) {
        try {
            const lenguage = await this.lenguageService.findOne(id);

            if (!lenguage) {
                throw new NotFoundException(`Lenguage with ID ${id} not found`);
            }

            await this.lenguageService.remove(id);

            return {
                message: 'Lenguage deleted successfully',
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while deleting the lenguage');
        }
    }
}
