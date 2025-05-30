import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
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
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get(':id/profile-image')
  async getProfileImage(@Param('id') id: string) {
    const user = await this.doctorsService.findById(id);

    if (!user || !user.profileImage) {
      throw new NotFoundException('User or profile image not found');
    }

    const url = await this.fileService.getFileUrl(user.profileImage.id);
    return { url };
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }
}