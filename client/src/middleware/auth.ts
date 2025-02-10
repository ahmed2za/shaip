import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
      }

      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        id: string;
        email: string;
        role: string;
      };

      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
    }
  };
}

export function withAdminAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
      }

      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        id: string;
        email: string;
        role: string;
      };

      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'غير مصرح لك بالوصول لهذه الصفحة' });
      }

      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح لك بالوصول' });
    }
  };
}
