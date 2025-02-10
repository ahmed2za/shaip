import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء جلب التصنيفات' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
