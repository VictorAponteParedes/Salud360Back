import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "vaponte520@gmail.com",
    pass: "fbua wfgh orix itov",
  },
});

transporter.sendMail({
  from: 'vaponte520@gmail.com',
  to: 'vaponte520@gmail.com',
  subject: 'Prueba directa',
  text: '¡Hola! Esto es una prueba directa desde Node.js',
}, (err, info) => {
  if (err) {
    return console.error('Error:', err);
  }
  console.log('Correo enviado:', info.response);
});