import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            lastLogin: true,
            phone: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(users);

      case 'POST':
        const { name, email, role, status, phone } = req.body;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            role,
            status,
            phone,
          },
        });

        return res.status(201).json(newUser);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('API Users', 'Error handling users request', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
