import { Request, Response } from 'express';
import { User } from '../models/user';
import { OtpToken } from '../models/OtpToken';
import { env } from '../config/env';
import { generateOtp, hashOtp } from '../services/otp';
import { sendOtpEmail } from '../services/mailer';
import jwt from 'jsonwebtoken';


const setJwtCookie = (res: Response, payload: any) => {
const token = jwt.sign(
  payload,
  env.JWT_SECRET,
  { expiresIn: '7d' }
);
res.cookie('token', token, {
httpOnly: true,
sameSite: 'lax',
secure: false, // set true in production with HTTPS
maxAge: 7 * 24 * 60 * 60 * 1000,
});
return token;
};


//signup
export const signupStart = async (req: Request, res: Response) => {
const { name, dob, email } = req.body as { name: string; dob: string; email: string };
if (!name || !dob || !email) return res.status(400).json({ message: 'All fields required' });


const otp = generateOtp();
const otpHash = hashOtp(otp);
const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);


await OtpToken.deleteMany({ email, purpose: 'signup' });
await OtpToken.create({ email, otpHash, purpose: 'signup', expiresAt, attempts: 0 });

console.log("OTP for signup:", otp); // For testing, remove in production
console.log("Email:", email);
await sendOtpEmail(email, otp);
return res.json({ message: 'OTP sent to email' });
};


//signup verify
export const signupVerify = async (req: Request, res: Response) => {
const { name, dob, email, otp } = req.body as { name: string; dob: string; email: string; otp: string };
if (!name || !dob || !email || !otp) return res.status(400).json({ message: 'Missing fields' });


const record = await OtpToken.findOne({ email, purpose: 'signup' });
if (!record) return res.status(400).json({ message: 'OTP not requested' });
if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
if (record.attempts >= 5) return res.status(429).json({ message: 'Too many attempts' });


const valid = record.otpHash === hashOtp(otp);
record.attempts += 1;
await record.save();
if (!valid) return res.status(400).json({ message: 'Invalid OTP' });


let user = await User.findOne({ email });
if (!user) user = await User.create({ name, dob, email });
await OtpToken.deleteMany({ email, purpose: 'signup' });


const token = setJwtCookie(res, { id: user.id, email: user.email });
return res.json({ message: 'Signup success', token, user });
};


//sign-in
export const signinStart = async (req: Request, res: Response) => {
const { email } = req.body as { email: string };
if (!email) return res.status(400).json({ message: 'Email required' });
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: 'User not found' });


const otp = generateOtp();
const otpHash = hashOtp(otp);
const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);


await OtpToken.deleteMany({ email, purpose: 'signin' });
await OtpToken.create({ email, otpHash, purpose: 'signin', expiresAt, attempts: 0 });


console.log("OTP for signin:", otp); // For testing, remove in production
console.log("Email:", email);
await sendOtpEmail(email, otp);
return res.json({ message: 'OTP sent to email' });
};



// sign in verify
export const signinVerify = async (req: Request, res: Response) => {
const { email, otp } = req.body as { email: string; otp: string };
if (!email || !otp) return res.status(400).json({ message: 'Missing fields' });


const record = await OtpToken.findOne({ email, purpose: 'signin' });
if (!record) return res.status(400).json({ message: 'OTP not requested' });
if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
if (record.attempts >= 5) return res.status(429).json({ message: 'Too many attempts' });


const valid = record.otpHash === hashOtp(otp);
record.attempts += 1;
await record.save();
if (!valid) return res.status(400).json({ message: 'Invalid OTP' });


const user = await (await import('../models/user')).User.findOne({ email });
if (!user) return res.status(404).json({ message: 'User not found' });


await OtpToken.deleteMany({ email, purpose: 'signin' });
const token = setJwtCookie(res, { id: user.id, email: user.email });
return res.json({ message: 'Signin success', token, user });
};


// get current user
export const me = async (req: Request, res: Response) => {
  try {
    // Extract token (from cookie or Authorization header)
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(200).json({ user: null });
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };

    // Find user in DB
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      return res.status(404).json({ user: null, message: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Error in /me:', err);
    return res.status(401).json({ user: null, message: 'Invalid or expired token' });
  }
};