import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const ads = await prisma.advertisement.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.json(ads);
      } catch (error) {
        console.error('Error fetching ads:', error);
        return res.status(500).json({ error: 'Error fetching ads' });
      }

    case 'POST':
      try {
        const ad = await prisma.advertisement.create({
          data: {
            name: req.body.name,
            code: req.body.code,
            location: req.body.location,
            active: req.body.active,
            startDate: req.body.startDate ? new Date(req.body.startDate) : null,
            endDate: req.body.endDate ? new Date(req.body.endDate) : null,
          },
        });
        return res.json(ad);
      } catch (error) {
        console.error('Error creating ad:', error);
        return res.status(500).json({ error: 'Error creating ad' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
