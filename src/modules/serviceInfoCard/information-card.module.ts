import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationCardController } from './information-card.controller';
import { InformationCardService } from './information-card.service';
import { InformationCard } from './entities/service-information-card.entities';
import { File } from '../file-upload/entities/file.entity';
import { FileService } from '../file-upload/file.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([InformationCard, File]),
    ],
    controllers: [InformationCardController],
    providers: [InformationCardService, FileService],
})
export class InformationCardModule { }
