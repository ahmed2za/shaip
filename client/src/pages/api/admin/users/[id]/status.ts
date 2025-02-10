import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!status || !['ACTIVE', 'BLOCKED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    // Check if user exists and get their current status
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, status: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow modifying admin users
    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot modify admin users' });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: id,
        type: status === 'BLOCKED' ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_ACTIVATED',
        title: status === 'BLOCKED' ? 'تم حظر حسابك' : 'تم تفعيل حسابك',
        message: status === 'BLOCKED' 
          ? 'تم حظر حسابك من قبل الإدارة. يرجى التواصل مع الدعم الفني للمزيد من المعلومات.'
          : 'تم إعادة تفعيل حسابك. يمكنك الآن استخدام جميع ميزات الموقع.',
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
}
