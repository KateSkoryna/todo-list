import { Request, Response, NextFunction } from 'express';
import { admin } from '../integrations/firebase';
import { UserRepository } from '../repositories/user.repository';

export interface AuthRequest extends Request {
  userId: string;
  userEmail: string;
  firebaseUid: string;
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(authHeader.slice(7));
    (req as AuthRequest).firebaseUid = decoded.uid;
    (req as AuthRequest).userEmail = decoded.email ?? '';
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const idToken = authHeader.slice(7);

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    const user = await UserRepository.findByFirebaseUid(decoded.uid);
    if (!user) {
      return res.status(401).json({ message: 'User profile not found' });
    }

    (req as AuthRequest).userId = user.id;
    (req as AuthRequest).userEmail = decoded.email ?? '';
    (req as AuthRequest).firebaseUid = decoded.uid;

    if (req.params.userId && req.params.userId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
