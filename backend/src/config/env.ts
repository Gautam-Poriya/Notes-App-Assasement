import dotenv from 'dotenv';
dotenv.config();


export const env = {
PORT: process.env.PORT || '5000',
MONGO_URI: process.env.MONGO_URI!,
JWT_SECRET: process.env.JWT_SECRET!,
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
SMTP_HOST: process.env.SMTP_HOST!,
SMTP_PORT: Number(process.env.SMTP_PORT || 587),
SMTP_USER: process.env.SMTP_USER!,
SMTP_PASS: process.env.SMPP_PASS || process.env.SMTP_PASS!,
FROM_EMAIL: process.env.FROM_EMAIL || 'no-reply@example.com',
OTP_TTL_MINUTES: Number(process.env.OTP_TTL_MINUTES || 10),
};