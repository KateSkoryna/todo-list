import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuthRequest } from '../middleware/auth.middleware';

export const AuthController = {
  getUser: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await UserRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: (error as Error).message,
      });
    }
  },

  provisionUser: async (req: Request, res: Response) => {
    try {
      const { firebaseUid, userEmail } = req as AuthRequest;
      const { firstName, lastName, username } = req.body;

      let user = await UserRepository.findByFirebaseUid(firebaseUid);
      if (!user) {
        // Existing account from old auth system — link firebaseUid by email
        user = await UserRepository.findByEmailAndLinkFirebaseUid(
          userEmail,
          firebaseUid
        );
      }
      if (!user) {
        const displayName = `${firstName} ${lastName}`.trim();
        user = await UserRepository.create(
          firebaseUid,
          userEmail,
          firstName || '',
          lastName || '',
          username || userEmail.split('@')[0],
          displayName || userEmail.split('@')[0]
        );
      }

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Error provisioning user',
        error: (error as Error).message,
      });
    }
  },
};
