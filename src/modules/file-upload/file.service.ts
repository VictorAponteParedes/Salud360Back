import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';

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
    const filePath = `uploads/${uniqueFilename}`;

    // Mover el archivo a la carpeta uploads
    await fs.rename(file.path, filePath);

    const newFile = this.fileRepository.create({
      filename: uniqueFilename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath.replace(/\\/g, '/'),
    });

    return this.fileRepository.save(newFile);
  }

  async getFileUrl(fileId: string): Promise<string> {
    const file = await this.fileRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    // Obtener la URL base según el entorno
    const baseUrl = this.configService.get('BASE_URL') ||
      (process.env.NODE_ENV === 'production'
        ? `https://${this.configService.get('RENDER_SERVICE_NAME')}.onrender.com`
        : 'http://localhost:3000');

    return `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
  }
}