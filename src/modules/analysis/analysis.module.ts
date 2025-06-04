import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entities';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { User } from '../user/entities/user.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analysis, User]),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}