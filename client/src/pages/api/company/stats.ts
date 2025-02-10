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
    const company = await prisma.company.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        reviews: true,
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const totalReviews = company.reviews.length;
    const averageRating =
      totalReviews > 0
        ? company.reviews.reduce((acc, review) => acc + review.rating, 0) /
          totalReviews
        : 0;

    // For now, we'll return some mock data for response rate and profile views
    // These features can be implemented later
    return res.status(200).json({
      totalReviews,
      averageRating,
      responseRate: 85, // Mock data
      profileViews: 150, // Mock data
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    return res.status(500).json({ message: 'Error fetching stats' });
  }
}
