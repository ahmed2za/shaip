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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const user = await prisma.user.findUnique({
          where: { id },
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
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);

      case 'PUT':
        const { name, email, role, status, phone } = req.body;

        // Check if email already exists for other users
        if (email) {
          const existingUser = await prisma.user.findFirst({
            where: {
              email,
              id: { not: id },
            },
          });

          if (existingUser) {
            return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
          }
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            role,
            status,
            phone,
          },
        });

        return res.status(200).json(updatedUser);

      case 'DELETE':
        // Prevent deleting the last admin
        if (req.body.role === 'admin') {
          const adminCount = await prisma.user.count({
            where: { role: 'admin' },
          });

          if (adminCount <= 1) {
            return res.status(400).json({ error: 'لا يمكن حذف آخر مسؤول في النظام' });
          }
        }

        await prisma.user.delete({
          where: { id },
        });

        return res.status(204).end();

      case 'PATCH':
        // Handle status updates
        if (req.url?.includes('/status')) {
          const { status } = req.body;
          
          if (!['active', 'suspended', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
          }

          const updatedUserStatus = await prisma.user.update({
            where: { id },
            data: { status },
          });

          return res.status(200).json(updatedUserStatus);
        }

        return res.status(400).json({ error: 'Invalid patch operation' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('API Users', `Error handling user ${id}`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
