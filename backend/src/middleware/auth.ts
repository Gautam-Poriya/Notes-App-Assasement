import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';


export interface AuthRequest extends Request { user?: { id: string, email: string }; }


export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
try {
const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
if (!token) return res.status(401).json({ message: 'Unauthorized' });
const payload = jwt.verify(token, env.JWT_SECRET) as { id: string, email: string };
req.user = payload;
next();
} catch {
return res.status(401).json({ message: 'Unauthorized' });
}
};