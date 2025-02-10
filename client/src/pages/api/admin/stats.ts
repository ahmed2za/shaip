import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [
      totalUsers,
      totalCompanies,
      totalReviews,
      totalCategories,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: 'user' },
      }),
      prisma.company.count(),
      prisma.review.count(),
      prisma.category.count(),
    ]);

    return res.status(200).json({
      totalUsers,
      totalCompanies,
      totalReviews,
      totalCategories,
      pendingReviews: 0, // Will be implemented later
      reportedReviews: 0, // Will be implemented later
      totalBlogPosts: 0, // Will be implemented later
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Error fetching stats' });
  }
}
