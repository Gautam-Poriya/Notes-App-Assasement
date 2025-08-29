// import nodemailer from 'nodemailer';
// import { env } from '../config/env';


// export const transporter = nodemailer.createTransport({
// host: env.SMTP_HOST,
// port: env.SMTP_PORT,
// secure: false,
// auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
// });


// export async function sendOtpEmail(to: string, otp: string) {
// const info = await transporter.sendMail({
// from: env.FROM_EMAIL,
// to,
// subject: 'Your OTP Code',
// text: `Your OTP code is ${otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
// html: `<p>Your OTP code is <b>${otp}</b>. It expires in ${env.OTP_TTL_MINUTES} minutes.</p>`,
// });
// return info.messageId;
// }
import nodemailer from "nodemailer";
import { env } from "../config/env";

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or SMTP host
    auth: {
      user: env.SMTP_USER, // your email
      pass: env.SMTP_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: env.SMTP_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
  });
};
