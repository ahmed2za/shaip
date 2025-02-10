import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { location } = req.query;

  try {
    const ad = await prisma.advertisement.findFirst({
      where: {
        location: String(location),
        active: true,
        OR: [
          {
            startDate: null,
            endDate: null,
          },
          {
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: new Date(),
            },
          },
          {
            startDate: {
              lte: new Date(),
            },
            endDate: null,
          },
          {
            startDate: null,
            endDate: {
              gte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(ad);
  } catch (error) {
    console.error('Error fetching ad:', error);
    return res.status(500).json({ error: 'Error fetching ad' });
  }
}
