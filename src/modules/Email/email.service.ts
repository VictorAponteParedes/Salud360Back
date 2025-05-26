import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: this.configService.get('NODE_ENV') === 'production' ? true : false
      }
    });
  }

  async sendResetPassword(email: string, code: string) {
    try {
      await this.verifyConnection();

      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'Email',
        'templates',
        'reset-code.html'
      );

      let html = fs.readFileSync(templatePath, 'utf8');
      html = html.replace(/{{resetCode}}/g, code);
      html = html.replace(/{{year}}/g, new Date().getFullYear().toString());

      const mailOptions = {
        from: `"${this.configService.get('EMAIL_FROM_NAME')}" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: 'Código para restablecer tu contraseña',
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error en EmailService:', {
        error: error.message,
        stack: error.stack
      });
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Conexión SMTP verificada');
    } catch (error) {
      console.error('Error al verificar SMTP:', error);
      throw new Error('Configuración SMTP inválida');
    }
  }
}