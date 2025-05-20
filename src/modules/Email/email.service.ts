import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/nodemailer';

@Injectable()
export class EmailService {
  async sendResetPassword(email: string, token: string) {
    
    const resetUrl = `http://localhost:3000/users/reset-password?token=${token}`;
      console.log('Enviando correo a:', email, 'con url:', resetUrl);
      console.log(`Preparando email para: ${email}`); // Log de depuración
    
    try {
      const mailOptions = {
        from: '"Nombre de tu App" <vaponte520@gmail.com>',
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
          <h1>Restablecimiento de contraseña</h1>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}">Restablecer contraseña</a>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `,
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