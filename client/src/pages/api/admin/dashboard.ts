import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get metrics data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get today's users
    const todayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today.toISOString().split('T')[0],
        },
      },
    });

    // Get yesterday's users for trend calculation
    const yesterdayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: yesterday.toISOString().split('T')[0],
          lt: today.toISOString().split('T')[0],
        },
      },
    });

    // Calculate user growth trend
    const userChange = yesterdayUsers === 0 
      ? 100 
      : ((todayUsers - yesterdayUsers) / yesterdayUsers) * 100;

    // Get today's revenue (example calculation, adjust based on your needs)
    const todayRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: today.toISOString().split('T')[0],
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Get yesterday's revenue
    const yesterdayRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: yesterday.toISOString().split('T')[0],
          lt: today.toISOString().split('T')[0],
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate revenue trend
    const todayRevenueAmount = todayRevenue._sum.amount || 0;
    const yesterdayRevenueAmount = yesterdayRevenue._sum.amount || 0;
    const revenueChange = yesterdayRevenueAmount === 0 
      ? 100 
      : ((todayRevenueAmount - yesterdayRevenueAmount) / yesterdayRevenueAmount) * 100;

    // Return the metrics
    return res.status(200).json({
      metrics: {
        activeUsers: {
          value: todayUsers,
          trend: userChange >= 0 ? 'up' : 'down',
          change: Math.abs(userChange),
        },
        revenue: {
          value: todayRevenueAmount,
          trend: revenueChange >= 0 ? 'up' : 'down',
          change: Math.abs(revenueChange),
        },
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
