import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { entityId, entityType } = req.query;

        const draft = await prisma.draftComment.findFirst({
          where: {
            entityId: String(entityId),
            entityType: String(entityType),
            user: { id: session.user.id },
          },
          orderBy: { createdAt: 'desc' },
        });

        return res.json(draft || { content: '' });
      } catch (error) {
        console.error('Error fetching draft:', error);
        return res.status(500).json({ error: 'Error fetching draft' });
      }

    case 'POST':
      try {
        const { content, entityId, entityType } = req.body;

        // Delete any existing drafts for this entity
        await prisma.draftComment.deleteMany({
          where: {
            entityId,
            entityType,
            user: { id: session.user.id },
          },
        });

        // Create new draft
        const draft = await prisma.draftComment.create({
          data: {
            content,
            entityId,
            entityType,
            user: { connect: { id: session.user.id } },
            sessionId: session.id,
          },
        });

        return res.json(draft);
      } catch (error) {
        console.error('Error saving draft:', error);
        return res.status(500).json({ error: 'Error saving draft' });
      }

    case 'DELETE':
      try {
        const { entityId, entityType } = req.body;

        await prisma.draftComment.deleteMany({
          where: {
            entityId,
            entityType,
            user: { id: session.user.id },
          },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting draft:', error);
        return res.status(500).json({ error: 'Error deleting draft' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
