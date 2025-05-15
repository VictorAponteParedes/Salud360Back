// src/modules/specialties/specialty.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty';

@Controller('specialties')
export class SpecialtyController {
    constructor(private readonly specialtyService: SpecialtyService) { }

    @Post()
    create(@Body() dto: CreateSpecialtyDto) {
        return this.specialtyService.create(dto);
    }

    @Get()
    findAll() {
        return this.specialtyService.findAllSpecialty();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.specialtyService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.specialtyService.removeSpecialty(+id);
    }
}
