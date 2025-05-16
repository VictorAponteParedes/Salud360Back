import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguages } from '../lenguages/entities/lenguages.entities';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Lenguages)
    private readonly languageRepository: Repository<Lenguages>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    // Buscar especialidades
    const specialties = await this.specialtyRepository.findByIds(
      createDoctorDto.specialtyIds,
    );
    
    if (specialties.length !== createDoctorDto.specialtyIds.length) {
      throw new NotFoundException('Una o más especialidades no existen');
    }

    // Buscar lenguajes
    const languages = await this.languageRepository.findByIds(
      createDoctorDto.languageIds,
    );
    
    if (languages.length !== createDoctorDto.languageIds.length) {
      throw new NotFoundException('Uno o más lenguajes no existen');
    }

    // Crear doctor
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      specialties,
      languages,
    });

    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    return this.doctorRepository.find({
      relations: ['specialties', 'languages'],
    });
  }

  async findOne(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['specialties', 'languages'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }
}