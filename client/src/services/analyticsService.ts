import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

class AnalyticsService {
  async getDashboardMetrics(timeRange: TimeRange): Promise<{
    users: AnalyticsMetric;
    orders: AnalyticsMetric;
    revenue: AnalyticsMetric;
    activeUsers: AnalyticsMetric;
  }> {
    try {
      const previousStart = new Date(timeRange.start);
      previousStart.setDate(previousStart.getDate() - getDaysDifference(timeRange));

      const [
        currentUsers,
        previousUsers,
        currentOrders,
        previousOrders,
        currentRevenue,
        previousRevenue,
        activeUsers,
        previousActiveUsers,
      ] = await Promise.all([
        // Users metrics
        prisma.user.count({
          where: {
            createdAt: {
              gte: timeRange.start,
              lte: timeRange.end,
            },
          },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: previousStart,
              lt: timeRange.start,
            },
          },
        }),

        // Orders metrics
        prisma.order.count({
          where: {
            createdAt: {
              gte: timeRange.start,
              lte: timeRange.end,
            },
          },
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: previousStart,
              lt: timeRange.start,
            },
          },
        }),

        // Revenue metrics
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: timeRange.start,
              lte: timeRange.end,
            },
            status: 'COMPLETED',
          },
          _sum: {
            total: true,
          },
        }),
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: previousStart,
              lt: timeRange.start,
            },
            status: 'COMPLETED',
          },
          _sum: {
            total: true,
          },
        }),

        // Active users metrics
        prisma.userActivity.count({
          where: {
            timestamp: {
              gte: timeRange.start,
              lte: timeRange.end,
            },
          },
          distinct: ['userId'],
        }),
        prisma.userActivity.count({
          where: {
            timestamp: {
              gte: previousStart,
              lt: timeRange.start,
            },
          },
          distinct: ['userId'],
        }),
      ]);

      return {
        users: {
          label: 'New Users',
          value: currentUsers,
          change: calculatePercentageChange(currentUsers, previousUsers),
          trend: getTrend(currentUsers, previousUsers),
        },
        orders: {
          label: 'Orders',
          value: currentOrders,
          change: calculatePercentageChange(currentOrders, previousOrders),
          trend: getTrend(currentOrders, previousOrders),
        },
        revenue: {
          label: 'Revenue',
          value: currentRevenue._sum.total || 0,
          change: calculatePercentageChange(
            currentRevenue._sum.total || 0,
            previousRevenue._sum.total || 0
          ),
          trend: getTrend(
            currentRevenue._sum.total || 0,
            previousRevenue._sum.total || 0
          ),
        },
        activeUsers: {
          label: 'Active Users',
          value: activeUsers,
          change: calculatePercentageChange(activeUsers, previousActiveUsers),
          trend: getTrend(activeUsers, previousActiveUsers),
        },
      };
    } catch (error) {
      logger.error('AnalyticsService', 'Error getting dashboard metrics', error);
      throw error;
    }
  }

  async getRevenueChart(timeRange: TimeRange): Promise<ChartData> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
          status: 'COMPLETED',
        },
        select: {
          createdAt: true,
          total: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const dailyRevenue = groupByDay(orders, 'total');

      return {
        labels: dailyRevenue.map((item) => item.date),
        datasets: [
          {
            label: 'Revenue',
            data: dailyRevenue.map((item) => item.value),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        ],
      };
    } catch (error) {
      logger.error('AnalyticsService', 'Error getting revenue chart', error);
      throw error;
    }
  }

  async getUserActivityChart(timeRange: TimeRange): Promise<ChartData> {
    try {
      const activities = await prisma.userActivity.findMany({
        where: {
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        select: {
          timestamp: true,
          action: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      const dailyActivities = groupByDay(activities);

      return {
        labels: dailyActivities.map((item) => item.date),
        datasets: [
          {
            label: 'User Activities',
            data: dailyActivities.map((item) => item.value),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
          },
        ],
      };
    } catch (error) {
      logger.error('AnalyticsService', 'Error getting user activity chart', error);
      throw error;
    }
  }

  async getPopularPages(timeRange: TimeRange): Promise<{ page: string; views: number }[]> {
    try {
      const pageViews = await prisma.pageView.groupBy({
        by: ['path'],
        where: {
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            _all: 'desc',
          },
        },
        take: 10,
      });

      return pageViews.map((view) => ({
        page: view.path,
        views: view._count._all,
      }));
    } catch (error) {
      logger.error('AnalyticsService', 'Error getting popular pages', error);
      throw error;
    }
  }

  async getUserBehavior(timeRange: TimeRange): Promise<{
    averageSessionDuration: number;
    bounceRate: number;
    returningUsers: number;
  }> {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          startTime: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        select: {
          duration: true,
          bounced: true,
          userId: true,
        },
      });

      const totalSessions = sessions.length;
      const averageSessionDuration =
        sessions.reduce((acc, session) => acc + (session.duration || 0), 0) /
        totalSessions;

      const bouncedSessions = sessions.filter((session) => session.bounced).length;
      const bounceRate = (bouncedSessions / totalSessions) * 100;

      const uniqueUsers = new Set(sessions.map((session) => session.userId));
      const returningUsers = uniqueUsers.size;

      return {
        averageSessionDuration,
        bounceRate,
        returningUsers,
      };
    } catch (error) {
      logger.error('AnalyticsService', 'Error getting user behavior', error);
      throw error;
    }
  }
}

// Helper functions
function getDaysDifference(timeRange: TimeRange): number {
  return Math.ceil(
    (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function getTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
}

function groupByDay<T>(
  data: Array<T & { createdAt?: Date; timestamp?: Date }>,
  valueKey?: keyof T
): Array<{ date: string; value: number }> {
  const grouped = new Map<string, number>();

  data.forEach((item) => {
    const date = (item.createdAt || item.timestamp)!;
    const dateStr = date.toISOString().split('T')[0];
    const value = valueKey ? (item[valueKey] as number) : 1;

    grouped.set(dateStr, (grouped.get(dateStr) || 0) + value);
  });

  return Array.from(grouped.entries()).map(([date, value]) => ({
    date,
    value,
  }));
}

export const analyticsService = new AnalyticsService();
