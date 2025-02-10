import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
