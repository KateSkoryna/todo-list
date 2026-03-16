import { Response } from 'express';
import { StatsPeriod } from '@shared/types';
import { TodoRepository } from '../repositories/todo.repository';
import { AuthRequest } from '../middleware/auth.middleware';

const VALID_PERIODS: StatsPeriod[] = ['day', 'week', 'month', 'year'];

export const UserController = {
  getStats: async (req: AuthRequest, res: Response) => {
    try {
      const period = (req.query['period'] as StatsPeriod) || 'week';

      if (!VALID_PERIODS.includes(period)) {
        return res.status(400).json({
          message: `Invalid period. Must be one of: ${VALID_PERIODS.join(
            ', '
          )}`,
        });
      }

      const stats = await TodoRepository.getStats(req.userId, period);
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching stats',
        error: (error as Error).message,
      });
    }
  },
};
