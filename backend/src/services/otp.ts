import crypto from 'crypto';
import { env } from '../config/env';


export const generateOtp = (digits = 6) => {
const max = 10 ** digits;
const n = Math.floor(Math.random() * max);
return n.toString().padStart(digits, '0');
};


export const hashOtp = (otp: string) => {
return crypto.createHmac('sha256', env.JWT_SECRET).update(otp).digest('hex');
};