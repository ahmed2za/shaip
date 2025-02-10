import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
