import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, NotFoundException, Param, Patch, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file-upload/file.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { v4 as uuidv4 } from 'uuid';
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

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Req() req , @Body() changePassword :ChangePasswordDto
  ){
    return this.userService.changePassword(req.user.id, changePassword)
  }


  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'Si el correo existe, se enviará un enlace de recuperación.' };
    }
    const token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await this.userService.save(user);
    await this.emailService.sendResetPassword(email, token);
    return { message: 'Si el correo existe, se enviará un enlace de recuperación.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string
  ) {
    const user = await this.userService.findByResetToken(token);
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userService.save(user);
    return { message: 'Contraseña restablecida correctamente' };
  }

}