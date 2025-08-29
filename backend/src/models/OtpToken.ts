import { Schema, model } from 'mongoose';


interface IOtpToken {
email: string;
otpHash: string;
purpose: 'signup' | 'signin';
expiresAt: Date;
attempts: number;
}


const otpSchema = new Schema<IOtpToken>({
email: { type: String, required: true, index: true },
otpHash: { type: String, required: true },
purpose: { type: String, enum: ['signup', 'signin'], required: true },
expiresAt: { type: Date, required: true },
attempts: { type: Number, default: 0 },
}, { timestamps: true });


otpSchema.index({ email: 1, purpose: 1 }, { unique: false });


export const OtpToken = model<IOtpToken>('OtpToken', otpSchema);