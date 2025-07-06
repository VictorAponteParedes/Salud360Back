import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';


@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async createHospital(@Body() createHospitalDto: CreateHospitalDto, @UploadedFile() file: Express.Multer.File,) {
    try {
      if (!createHospitalDto || Object.keys(createHospitalDto).length === 0) {
        throw new BadRequestException('Hospital data is required');
      }

      const hospital = await this.hospitalService.createHospital(createHospitalDto, file);
      return {
        message: 'Hospital created successfully',
        data: hospital,
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the hospital');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllHospitals() {
    try {
      const hospitals = await this.hospitalService.findAll();
      return {
        message: 'Hospitals retrieved successfully',
        data: hospitals,
      };
    } catch (error) {
      console.error('Error fetching hospitals:', error);  // <-- Añade esto para ver el error real
      throw new InternalServerErrorException('An error occurred while retrieving hospitals');
    }
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findHospitalById(@Param('id') id: string) {
    try {
      const hospital = await this.hospitalService.findById(id);

      if (!hospital) {
        throw new NotFoundException(`Hospital with ID ${id} not found`);
      }

      return {
        message: 'Hospital retrieved successfully',
        data: hospital,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeHospital(@Param('id') id: string) {
    try {
      const hospital = await this.hospitalService.findById(id);

      if (!hospital) {
        throw new NotFoundException(`Hospital with ID ${id} not found`);
      }

      await this.hospitalService.remove(id);
      return {
        message: 'Hospital deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the hospital');
    }
  }
}