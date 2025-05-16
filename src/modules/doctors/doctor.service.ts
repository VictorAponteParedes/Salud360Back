import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguages } from '../lenguages/entities/lenguages.entities';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { User } from '../user/entities/user.entities';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Lenguages)
    private readonly languageRepository: Repository<Lenguages>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const specialties = await this.specialtyRepository.findBy({
      id: In(createDoctorDto.specialtyIds),
    });
    if (specialties.length !== createDoctorDto.specialtyIds.length) {
      throw new NotFoundException('Una o más especialidades no existen');
    }

    const languages = await this.languageRepository.findBy({
      id: In(createDoctorDto.languageIds),
    });
    if (languages.length !== createDoctorDto.languageIds.length) {
      throw new NotFoundException('Uno o más lenguajes no existen');
    }

    let users = [];
    if (createDoctorDto.patientIds && createDoctorDto.patientIds.length > 0) {
      users = await this.userRepository.findBy({
        id: In(createDoctorDto.patientIds),
      });
      if (users.length !== createDoctorDto.patientIds.length) {
        throw new NotFoundException('Uno o más pacientes no existen');
      }
    }

    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      specialties,
      languages,
      patients: users,
    });

    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    return this.doctorRepository.find({
      relations: ['specialties', 'languages', 'patients'],
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