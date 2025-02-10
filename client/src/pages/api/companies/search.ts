import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q, category, location, page = '1' } = req.query;
    const pageSize = 12;
    const pageNumber = parseInt(page as string);
    const skip = (pageNumber - 1) * pageSize;

    // Build filter conditions
    const where: any = {};
    
    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'جميع التصنيفات') {
      where.industry = category;
    }

    if (location && location !== 'جميع المدن') {
      where.location = location;
    }

    // Get companies with pagination
    const companies = await prisma.company.findMany({
      where,
      take: pageSize,
      skip,
      include: {
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get total count for pagination
    const totalCompanies = await prisma.company.count({ where });

    return res.status(200).json({
      companies,
      totalPages: Math.ceil(totalCompanies / pageSize),
      currentPage: pageNumber,
      totalCompanies
    });

  } catch (error) {
    console.error('Search companies error:', error);
    return res.status(500).json({
      message: 'حدث خطأ أثناء البحث عن الشركات',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
