import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { filter = 'ALL', search = '' } = req.query;
      const where: any = {};

      // Apply filters
      switch (filter) {
        case 'VERIFIED':
          where.emailVerified = { not: null };
          break;
        case 'UNVERIFIED':
          where.emailVerified = null;
          break;
      }

      // Apply search
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              reviews: true,
              companies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error('Error in users API:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
