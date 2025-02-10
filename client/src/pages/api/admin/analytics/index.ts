import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the date range for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get daily visits
    const dailyVisits = await prisma.companyView.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get top pages (companies)
    const topPages = await prisma.companyView.groupBy({
      by: ['companyId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Get company names for the top pages
    const companies = await prisma.company.findMany({
      where: {
        id: {
          in: topPages.map(page => page.companyId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get active users (users who have viewed companies in the last 24 hours)
    const activeUsers = await prisma.companyView.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get total companies count
    const totalCompanies = await prisma.company.count();

    // Get total reviews count
    const totalReviews = await prisma.review.count();

    // Get new reviews today
    const newReviewsToday = await prisma.review.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // Get user registrations per day for the last 30 days
    const userRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json({
      dailyVisits: dailyVisits.map(visit => ({
        date: visit.createdAt.toISOString(),
        visits: visit._count.id,
      })),
      topPages: topPages.map(page => ({
        path: companies.find(c => c.id === page.companyId)?.name || 'Unknown Company',
        views: page._count.id,
      })),
      activeUsers: activeUsers.length,
      totalUsers,
      totalCompanies,
      totalReviews,
      newReviewsToday,
      userRegistrations: userRegistrations.map(reg => ({
        date: reg.createdAt.toISOString(),
        count: reg._count.id,
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
