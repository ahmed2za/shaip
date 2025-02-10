import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Notification ID is required' });
      }

      const notification = await prisma.notification.update({
        where: {
          id: String(id),
        },
        data: {
          read: true,
        },
      });

      return res.status(200).json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
