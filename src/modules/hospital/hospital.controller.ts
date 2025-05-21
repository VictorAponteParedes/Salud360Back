import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  async create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalService.createHospital(createHospitalDto);
  }

  @Get()
  async findAll() {
    return this.hospitalService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.hospitalService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.hospitalService.remove(id);
    return { message: 'Hospital eliminado correctamente' };
  }
}