import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './file.controller';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule
  ],
  controllers: [UploadController],
  providers: [FileService],
  exports: [FileService]
})
export class UploadModule {}