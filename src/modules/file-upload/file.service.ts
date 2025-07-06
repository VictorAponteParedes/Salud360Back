import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService
  ) { }

  async saveFile(file: Express.Multer.File): Promise<File> {
    const fileExtension = extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const finalPath = `uploads/${uniqueFilename}`;

    if (!file.path) {
      throw new Error("El archivo no tiene una ruta temporal definida (file.path)");
    }

    // Mover archivo desde path temporal a path final
    await fs.rename(file.path, finalPath);

    const newFile = this.fileRepository.create({
      filename: uniqueFilename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: finalPath.replace(/\\/g, '/'),
    });

    return this.fileRepository.save(newFile);
  }

  async getFileUrl(fileId: string): Promise<string> {
    const file = await this.fileRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }
    return `${this.configService.get('BASE_URL') || 'http://localhost:3000'}/${file.path}`;
  }
}
