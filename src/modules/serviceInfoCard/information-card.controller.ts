import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { InformationCardService } from './information-card.service';
import { CreateInformationCardDto } from './dto/create-information-card.dto';
import { UpdateInformationCardDto } from './dto/update-information-card.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@Controller('information-cards')
export class InformationCardController {
    constructor(private readonly service: InformationCardService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() dto: CreateInformationCardDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        try {
            const created = await this.service.create(dto, file);
            return {
                message: 'Tarjeta creada correctamente',
                data: created
            };
        } catch (error) {
            console.error('Error completo:', error);
            throw new HttpException(
                error.message || 'Error al crear tarjeta',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get()
    async findAll() {
        try {
            const cards = await this.service.findAll();
            return { data: cards };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get('active')
    async findAllActive() {
        try {
            const cards = await this.service.findAllActive();
            return { data: cards };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const card = await this.service.findOne(id);
            return { data: card };
        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(error.message, status);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateInformationCardDto) {
        try {
            const result = await this.service.update(id, dto);
            return result;
        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(error.message, status);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            const result = await this.service.remove(id);
            return result;
        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(error.message, status);
        }
    }


    @Put(':id/status/:status')
    async updateStatus(
        @Param('id') id: string,
        @Param('status') status: string
    ) {
        try {
            const statusBool = status === 'true';
            const result = await this.service.setActiveStatus(id, statusBool);
            return result;
        } catch (error) {
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(error.message, statusCode);
        }
    }

}
