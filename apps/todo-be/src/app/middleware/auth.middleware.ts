import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@fyltura/types';

export interface AuthRequest extends Request {
  userId: string;
  userEmail: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    (req as AuthRequest).userId = payload.userId;
    (req as AuthRequest).userEmail = payload.email;

    if (req.params.userId && req.params.userId !== payload.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
