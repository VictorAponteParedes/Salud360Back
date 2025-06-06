import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    doctorId: string;

    @IsUUID()
    patientId: string;

    @IsDateString()
    appointmentDate: string;

    @IsString()
    reason: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
