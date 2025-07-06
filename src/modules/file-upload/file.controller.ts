import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from './file.service';
import { v4 as uuidv4 } from 'uuid';
import type { Express } from 'express'

@Controller('upload')
export class UploadController {
  constructor(private readonly fileService: FileService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        console.log('Archivo recibido:', file.originalname);
        const fileExtension = extname(file.originalname);
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        callback(null, uniqueFilename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Subiendo archivo...');
    const savedFile = await this.fileService.saveFile(file);
    const url = await this.fileService.getFileUrl(savedFile.id);

    return {
      id: savedFile.id,
      url: url,
      filename: savedFile.filename,
      originalname: savedFile.originalname,
      mimetype: savedFile.mimetype,
      size: savedFile.size
    };
  }
}