import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  async sendResetPassword(email: string, token: string) {
    const resetUrl = `http://localhost:3000/users/reset-password?token=${token}`;
    const templatePath = path.join(process.cwd(), 'src', 'modules', 'Email', 'templates', 'reset-password.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('{{resetUrl}}', resetUrl);

    try {
      const mailOptions = {
        from: '"Nombre de tu App" <vaponte520@gmail.com>',
        to: email,
        subject: 'Restablece tu contraseña',
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.response);
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }
}