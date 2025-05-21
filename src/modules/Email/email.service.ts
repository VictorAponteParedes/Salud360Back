import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  async sendResetPassword(email: string, code: string) {
    const templatePath = path.join(process.cwd(), 'src', 'modules', 'Email', 'templates', 'reset-code.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('{{resetCode}}', code);
    html = html.replace('{{year}}', new Date().getFullYear().toString());

    try {
      const mailOptions = {
        from: '"Nombre de tu App" <vaponte520@gmail.com>',
        to: email,
        subject: 'Código para restablecer tu contraseña',
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