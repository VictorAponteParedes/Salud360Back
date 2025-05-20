import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, NotFoundException, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file-upload/file.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Req() req , @Body() changePassword :ChangePasswordDto
  ){
    return this.userService.changePassword(req.user.id, changePassword)
  }

}