import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshRequest,
  JwtPayload,
} from '@fyltura/types';

const SALT_ROUNDS = 10;

function signAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

function signRefreshToken(payload: JwtPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

function buildAuthResponse(user: AuthResponse['user']): AuthResponse {
  const tokenPayload: JwtPayload = { userId: user.id, email: user.email };
  return {
    user,
    accessToken: signAccessToken(tokenPayload),
    refreshToken: signRefreshToken(tokenPayload),
  };
}

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, displayName }: RegisterRequest = req.body;

      if (!email || !password || !displayName) {
        return res
          .status(400)
          .json({ message: 'email, password, and displayName are required' });
      }

      const existing = await UserRepository.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await UserRepository.create(
        email,
        passwordHash,
        displayName
      );

      res.status(201).json(buildAuthResponse(user));
    } catch (error) {
      res
        .status(500)
        .json({
          message: 'Error registering user',
          error: (error as Error).message,
        });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'email and password are required' });
      }

      const userWithHash = await UserRepository.findByEmail(email);
      if (!userWithHash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, userWithHash.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { passwordHash: _passwordHash, ...user } = userWithHash;
      res.json(buildAuthResponse(user));
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error logging in', error: (error as Error).message });
    }
  },

  refresh: (req: Request, res: Response) => {
    try {
      const { refreshToken }: RefreshRequest = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'refreshToken is required' });
      }

      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');

      const payload = jwt.verify(refreshToken, secret) as JwtPayload;
      const tokenPayload: JwtPayload = {
        userId: payload.userId,
        email: payload.email,
      };

      res.json({ accessToken: signAccessToken(tokenPayload) });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ message: 'Invalid or expired refresh token' });
      }
      res
        .status(500)
        .json({
          message: 'Error refreshing token',
          error: (error as Error).message,
        });
    }
  },

  logout: (_req: Request, res: Response) => {
    res.json({ message: 'Logged out' });
  },

  getUser: async (req: Request, res: Response) => {
    try {
      const userId = (req as Request & { userId?: string }).userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await UserRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({
          message: 'Error fetching user',
          error: (error as Error).message,
        });
    }
  },
};
