import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const notifications = await prisma.notification.findMany({
        where: {
          userId: String(userId),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
