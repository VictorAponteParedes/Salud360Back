import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "vaponte520@gmail.com",
    pass: "fbua wfgh orix itov",
  },
});