import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Handle DELETE request
  if (req.method === 'DELETE') {
    try {
      // First, check if user exists
      const user = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't allow deleting other admins
      if (user.role === 'ADMIN') {
        return res.status(403).json({ error: 'Cannot delete admin users' });
      }

      // Delete user and related data
      await prisma.$transaction([
        // Delete user's reviews
        prisma.review.deleteMany({
          where: { userId: id },
        }),
        // Delete user's comments
        prisma.comment.deleteMany({
          where: { userId: id },
        }),
        // Delete user's notifications
        prisma.notification.deleteMany({
          where: { userId: id },
        }),
        // Delete the user
        prisma.user.delete({
          where: { id },
        }),
      ]);

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // Handle PUT request for status update
  if (req.method === 'PUT') {
    try {
      const { status } = req.body;

      if (!status || !['ACTIVE', 'BLOCKED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't allow blocking admins
      if (user.role === 'ADMIN') {
        return res.status(403).json({ error: 'Cannot modify admin users' });
      }

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

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user status:', error);
      return res.status(500).json({ error: 'Failed to update user status' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
