import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { Schedule } from '../schedule/entities/schedule.entity';
import { ScheduleDto } from '../schedule/dto/create-schedule.dto';

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
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly fileService: FileService
  ) { }

  async create(createDoctorDto: CreateDoctorDto, profileImageFile?: Express.Multer.File) {
    try {
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
        profileImage = await this.fileService.saveFile(profileImageFile);
      } else if (createDoctorDto.profileImageId) {
        profileImage = await this.fileRepository.findOneBy({ id: createDoctorDto.profileImageId });
        if (!profileImage) {
          throw new NotFoundException('Imagen de perfil no encontrada');
        }
      }

      // Validación de pacientes
      let patients = [];
      if (createDoctorDto.patientIds && createDoctorDto.patientIds.length > 0) {
        patients = await this.userRepository.findBy({
          id: In(createDoctorDto.patientIds),
        });
        if (patients.length !== createDoctorDto.patientIds.length) {
          throw new NotFoundException('Uno o más pacientes no existen');
        }
      }

      // Validación de hospitales
      let hospitals = [];
      if (createDoctorDto.hospitalId && createDoctorDto.hospitalId.length > 0) {
        hospitals = await this.hospitalRepository.findBy({
          id: In(createDoctorDto.hospitalId),
        });
        if (hospitals.length !== createDoctorDto.hospitalId.length) {
          throw new NotFoundException('Uno o más hospitales no existen');
        }
      }

      // Validación y creación de horarios
      let schedules: Schedule[] = [];
      if (createDoctorDto.scheduleDtos && createDoctorDto.scheduleDtos.length > 0) {
        schedules = createDoctorDto.scheduleDtos.map((scheduleDto: ScheduleDto) => {
          if (!scheduleDto.day || !scheduleDto.startTime || !scheduleDto.endTime) {
            throw new BadRequestException('Faltan datos requeridos para el horario');
          }
          return this.scheduleRepository.create({
            day: scheduleDto.day,
            startTime: scheduleDto.startTime,
            endTime: scheduleDto.endTime,
          });
        });
      }

      // Creación del doctor
      const doctor = this.doctorRepository.create({
        ...createDoctorDto,
        specialties,
        languages,
        patients,
        profileImage,
        hospitals,
        schedules,
      });

      // Guardar el doctor con los horarios
      const savedDoctor = await this.doctorRepository.save(doctor);
      return savedDoctor;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el doctor');
    }
  }

  async findAll() {
    try {
      const doctors = await this.doctorRepository.find({
        relations: ['specialties', 'languages', 'patients', 'profileImage', 'hospitals', 'schedules'],
      });
      return doctors;
    } catch (error) {
      throw new BadRequestException('Error al obtener los doctores');
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('El ID del doctor es requerido');
      }
      const doctor = await this.doctorRepository.findOne({
        where: { id },
        relations: ['specialties', 'languages', 'profileImage', 'patients', 'hospitals', 'schedules'],
      });
      if (!doctor) {
        throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
      }
      return doctor;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el doctor');
    }
  }

  async findById(id: string): Promise<Doctor | null> {
    try {
      if (!id) {
        throw new BadRequestException('El ID del doctor es requerido');
      }
      const doctor = await this.doctorRepository.findOne({
        where: { id },
        relations: ['profileImage', 'schedules'],
      });
      return doctor;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el doctor');
    }
  }
}