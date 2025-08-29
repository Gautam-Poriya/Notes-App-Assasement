import { Schema, model } from 'mongoose';


interface IUser {
name: string;
dob: string; // ISO date string
email: string;
createdAt: Date;
}


const userSchema = new Schema<IUser>({
name: { type: String, required: true },
dob: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true, index: true },
createdAt: { type: Date, default: Date.now },
});


export const User = model<IUser>('User', userSchema);