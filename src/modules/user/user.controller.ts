import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, NotFoundException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file-upload/file.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.register(createUserDto, file);
  }

  @Get(':id/profile-image')
  async getProfileImage(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user || !user.profileImage) {
      throw new NotFoundException('User or profile image not found');
    }

    const url = await this.fileService.getFileUrl(user.profileImage.id);
    return { url };
  }
}