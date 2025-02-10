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
        const pages = await prisma.staticPage.findMany({
          orderBy: { lastModified: 'desc' },
        });
        return res.status(200).json(pages);

      case 'POST':
        const { title, slug, content, metaDescription } = req.body;

        // Check if slug already exists
        const existingPage = await prisma.staticPage.findUnique({
          where: { slug },
        });

        if (existingPage) {
          return res.status(400).json({ error: 'الرابط مستخدم بالفعل' });
        }

        const newPage = await prisma.staticPage.create({
          data: {
            title,
            slug,
            content,
            metaDescription,
            lastModified: new Date(),
          },
        });

        return res.status(201).json(newPage);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('API Pages', 'Error handling pages request', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
