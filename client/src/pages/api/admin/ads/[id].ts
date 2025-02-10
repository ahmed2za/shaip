import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const ad = await prisma.advertisement.update({
          where: { id: String(id) },
          data: {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            link: req.body.link,
            position: req.body.position,
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            isActive: req.body.isActive,
          },
        });
        return res.json(ad);
      } catch (error) {
        console.error('Error updating ad:', error);
        return res.status(500).json({ error: 'Error updating ad' });
      }

    case 'DELETE':
      try {
        await prisma.advertisement.delete({
          where: { id: String(id) },
        });
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting ad:', error);
        return res.status(500).json({ error: 'Error deleting ad' });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
