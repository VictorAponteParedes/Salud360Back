import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Res,
    HttpStatus,
    NotFoundException
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Response } from 'express';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    // Crear una nueva cita
    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto, @Res() res: Response) {
        try {
            const appointment = await this.appointmentsService.create(createAppointmentDto);
            return res.status(HttpStatus.CREATED).json(appointment);
        } catch (error) {
            console.error('Error en el controlador al crear cita:', error);
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Ocurrió un error inesperado al crear la cita',
            });
        }
    }

    @Get()
    async findAll(@Res() res: Response) {
        try {
            const appointments = await this.appointmentsService.findAll();
            return res.status(HttpStatus.OK).json(appointments);
        } catch (error) {
            console.error('Error en el controlador al obtener citas:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No se pudieron obtener las citas',
            });
        }
    }
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const appointment = await this.appointmentsService.findById(id);
            if (!appointment) {
                throw new NotFoundException(`Cita con ID ${id} no encontrada`);
            }
            return res.status(HttpStatus.OK).json(appointment);
        } catch (error) {
            console.error(`Error al obtener cita con ID ${id}:`, error);
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Error al obtener la cita',
            });
        }
    }
    @Get('patient/:patientId')
    async findByPatient(@Param('patientId') patientId: string, @Res() res: Response) {
        try {
            const appointments = await this.appointmentsService.findByPatientId(patientId);
            return res.status(HttpStatus.OK).json(appointments);
        } catch (error) {
            console.error(`Error al obtener citas para paciente ${patientId}:`, error);
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'No se pudieron obtener las citas del paciente',
            });
        }
    }

}
