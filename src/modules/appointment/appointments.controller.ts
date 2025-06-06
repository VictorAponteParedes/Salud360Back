import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Response } from 'express';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

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
}
