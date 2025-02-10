import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, isVerified: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: id,
        type: 'ACCOUNT_VERIFIED',
        title: 'تم توثيق حسابك',
        message: 'تهانينا! تم توثيق حسابك من قبل الإدارة.',
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Failed to verify user' });
  }
}
