import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entities';
import { User } from '../user/entities/user.entities';
import { CreateAnalysisDto } from './dto/create-doctor.dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAnalysisDto: CreateAnalysisDto) {
    const patient = await this.userRepository.findOne({
      where: { id: createAnalysisDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${createAnalysisDto.patientId} no encontrado`);
    }

    const analysis = this.analysisRepository.create({
      ...createAnalysisDto,
      patient,
    });

    return this.analysisRepository.save(analysis);
  }

  async findAll() {
    return this.analysisRepository.find({
      relations: ['patient'],
      order: { analysisDate: 'DESC' }, 
    });
  }

  async findOne(id: string) {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!analysis) {
      throw new NotFoundException(`Análisis con ID ${id} no encontrado`);
    }

    return analysis;
  }
}