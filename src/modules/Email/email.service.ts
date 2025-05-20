import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/nodemailer';

@Injectable()
export class EmailService {
  async sendResetPassword(email: string, token: string) {
  const resetUrl = `http://localhost:3000/users/reset-password?token=${token}`;
  console.log('Enviando correo a:', email, 'con url:', resetUrl); // <-- agrega esto
  await transporter.sendMail({
    from: "vaponte520@gmail.com",
    to: email,
    subject: 'Restablece tu contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  });
}
}