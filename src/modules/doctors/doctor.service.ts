import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Doctor } from './entities/doctors.entities';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Lenguage } from '../lenguages/entities/lenguages.entities';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { User } from '../user/entities/user.entities';
import { FileService } from '../file-upload/file.service';
import { File } from '../file-upload/entities/file.entity';
import { Hospital } from '../hospital/entities/hospital.entities';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Lenguage)
    private readonly languageRepository: Repository<Lenguage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private fileService: FileService
  ) { }

  async create(createDoctorDto: CreateDoctorDto, profileImageFile?: Express.Multer.File) {
    // Validación de especialidades
    let specialties = [];
    if (createDoctorDto.specialtyIds && createDoctorDto.specialtyIds.length > 0) {
      specialties = await this.specialtyRepository.findBy({
        id: In(createDoctorDto.specialtyIds),
      });

      if (specialties.length !== createDoctorDto.specialtyIds.length) {
        throw new NotFoundException('Una o más especialidades no existen');
      }
    }

    // Validación de idiomas
    let languages = [];
    if (createDoctorDto.languageIds && createDoctorDto.languageIds.length > 0) {
      languages = await this.languageRepository.findBy({
        id: In(createDoctorDto.languageIds),
      });

      if (languages.length !== createDoctorDto.languageIds.length) {
        throw new NotFoundException('Uno o más lenguajes no existen');
      }
    }


    // Manejo de la imagen de perfil
    let profileImage: File | null = null;
    if (profileImageFile) {
      // Subir nueva imagen
      profileImage = await this.fileService.saveFile(profileImageFile);
    } else if (createDoctorDto.profileImageId) {
      // Usar imagen existente
      profileImage = await this.fileRepository.findOneBy({ id: createDoctorDto.profileImageId });
      if (!profileImage) {
        throw new NotFoundException('Imagen de perfil no encontrada');
      }
    }

    // Validación de pacientes (si existen)
    let users = [];
    if (createDoctorDto.patientIds && createDoctorDto.patientIds.length > 0) {
      users = await this.userRepository.findBy({
        id: In(createDoctorDto.patientIds),
      });

      if (users.length !== createDoctorDto.patientIds.length) {
        throw new NotFoundException('Uno o más pacientes no existen');
      }
    }

    let hospitals = [];
    if (createDoctorDto.hospitalId && createDoctorDto.hospitalId.length > 0) {
      hospitals = await this.hospitalRepository.findBy({
        id: In(createDoctorDto.hospitalId),
      });

      if (hospitals.length !== createDoctorDto.hospitalId.length) {
        throw new NotFoundException('Uno o más hospitales no existen');
      }
    }


    // Creación del doctor
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      specialties,
      languages,
      patients: users,
      profileImage,
      hospitals,
    });

    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    return this.doctorRepository.find({
      relations: ['specialties', 'languages', 'patients', 'profileImage'],
    });
  }

  async findOne(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['specialties', 'languages', 'profileImage', 'patients', 'hospital'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }
  async findById(id: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ['profileImage']
    });
  }
}