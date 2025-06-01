import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DoctorsService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { FileService } from '../file-upload/file.service';

@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly fileService: FileService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    try {
      if (!createDoctorDto || Object.keys(createDoctorDto).length === 0) {
        throw new BadRequestException('Doctor data is required');
      }

      const newDoctor = await this.doctorsService.create(createDoctorDto);
      return {
        message: 'Doctor created successfully',
        data: newDoctor,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the doctor',
      );
    }
  }

  @Get(':id/profile-image')
  async getDoctorProfileImage(@Param('id') id: string) {
    try {
      const doctor = await this.doctorsService.findById(id);

      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${id} not found`);
      }

      if (!doctor.profileImage || !doctor.profileImage.id) {
        throw new NotFoundException('Profile image not found for this doctor');
      }

      const imageUrl = await this.fileService.getFileUrl(
        doctor.profileImage.id,
      );

      return {
        message: 'Profile image retrieved successfully',
        url: imageUrl,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllDoctors() {
    try {
      const doctors = await this.doctorsService.findAll();
      return {
        message: 'Doctors retrieved successfully',
        data: doctors,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving doctors',
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findDoctorById(@Param('id') id: string) {
    try {
      const doctor = await this.doctorsService.findOne(id);

      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${id} not found`);
      }

      return {
        message: 'Doctor retrieved successfully',
        data: doctor,
      };
    } catch (error) {
      throw error;
    }
  }
}
