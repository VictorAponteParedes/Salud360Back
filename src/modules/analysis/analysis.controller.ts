import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
    ParseUUIDPipe,
    NotFoundException,
  } from '@nestjs/common';
  import { AnalysisService } from './analysis.service';
  import { CreateAnalysisDto } from './dto/create-doctor.dto';
  
  @Controller('analysis')
  export class AnalysisController {
    constructor(private readonly analysisService: AnalysisService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createAnalysisDto: CreateAnalysisDto) {
      try {
        const newAnalysis = await this.analysisService.create(createAnalysisDto);
        return {
          status: 'success',
          data: newAnalysis,
        };
      } catch (error) {
        return {
          status: 'error',
          message: error.message || 'Error al crear el análisis',
        };
      }
    }
  
    @Get()
    async findAll() {
      try {
        const analyses = await this.analysisService.findAll();
        return {
          status: 'success',
          data: analyses,
        };
      } catch (error) {
        return {
          status: 'error',
          message: error.message || 'Error al obtener los análisis',
        };
      }
    }
  
    @Get(':id')
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      try {
        const analysis = await this.analysisService.findOne(id);
        if (!analysis) {
          throw new NotFoundException('Análisis no encontrado');
        }
        return {
          status: 'success',
          data: analysis,
        };
      } catch (error) {
        return {
          status: 'error',
          message: error.message || 'Error al obtener el análisis',
        };
      }
    }
  }