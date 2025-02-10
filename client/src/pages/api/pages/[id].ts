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
    return res.status(400).json({ error: 'Invalid page ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const page = await prisma.staticPage.findUnique({
          where: { id },
        });

        if (!page) {
          return res.status(404).json({ error: 'Page not found' });
        }

        return res.status(200).json(page);

      case 'PUT':
        const { title, slug, content, metaDescription } = req.body;

        // Check if new slug conflicts with existing pages
        if (slug) {
          const existingPage = await prisma.staticPage.findFirst({
            where: {
              slug,
              id: { not: id },
            },
          });

          if (existingPage) {
            return res.status(400).json({ error: 'الرابط مستخدم بالفعل' });
          }
        }

        const updatedPage = await prisma.staticPage.update({
          where: { id },
          data: {
            title,
            slug,
            content,
            metaDescription,
            lastModified: new Date(),
          },
        });

        return res.status(200).json(updatedPage);

      case 'DELETE':
        await prisma.staticPage.delete({
          where: { id },
        });

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('API Pages', `Error handling page ${id}`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
