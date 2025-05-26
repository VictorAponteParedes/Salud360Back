import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, NotFoundException, Param, Patch, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file-upload/file.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from '../Email/email.service';
import * as bcrypt from 'bcrypt';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly emailService: EmailService
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

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id)
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers()
  }


  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Req() req, @Body() changePassword: ChangePasswordDto
  ) {
    return this.userService.changePassword(req.user.id, changePassword)
  }


  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'Si el correo existe, se enviará un código de recuperación.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = code;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await this.userService.save(user);
    await this.emailService.sendResetPassword(email, code);
    return { message: 'Si el correo existe, se enviará un código de recuperación.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ) {
    const user = await this.userService.findByResetToken(code);
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Código inválido o expirado');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userService.save(user);
    return { message: 'Contraseña restablecida correctamente' };
  }

}