// src/modules/lenguages/lenguaje.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LenguageService } from './lenguage.service';
import { CreateLenguageDto } from './dto/create-lenguage.dto';

@Controller('lenguages')
export class LenguageController {
    constructor(private readonly lenguageService: LenguageService) { }

    @Post()
    create(@Body() createLenguageDto: CreateLenguageDto) {
        return this.lenguageService.create(createLenguageDto);
    }

    @Get()
    findAll() {
        return this.lenguageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lenguageService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lenguageService.remove(id);
    }
}
