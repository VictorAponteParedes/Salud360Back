import { IsUUID, IsDateString, IsString, Matches } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    doctorId: string;

    @IsUUID()
    patientId: string;

    @IsDateString()
    appointmentDate: string; // YYYY-MM-DD

    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'appointmentTime debe estar en formato HH:MM',
    })
    appointmentTime: string; // HH:MM

    @IsString()
    reason: string;

    @IsString()
    notes?: string;
}
