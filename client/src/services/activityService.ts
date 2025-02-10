import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

export interface ActivityData {
  userId: string;
  action: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export interface SessionData {
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pages: string[];
  bounced: boolean;
  device?: string;
  browser?: string;
  os?: string;
}

class ActivityService {
  async trackActivity(data: ActivityData) {
    try {
      await prisma.userActivity.create({
        data: {
          userId: data.userId,
          action: data.action,
          details: data.details,
          ip: data.ip,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      logger.error('ActivityService', 'Error tracking activity', error);
    }
  }

  async trackPageView(userId: string | null, path: string, referrer?: string) {
    try {
      await prisma.pageView.create({
        data: {
          userId,
          path,
          referrer,
        },
      });
    } catch (error) {
      logger.error('ActivityService', 'Error tracking page view', error);
    }
  }

  async startSession(data: Omit<SessionData, 'endTime' | 'duration'>) {
    try {
      return await prisma.userSession.create({
        data: {
          userId: data.userId,
          startTime: data.startTime,
          pages: data.pages,
          bounced: data.bounced,
          device: data.device,
          browser: data.browser,
          os: data.os,
        },
      });
    } catch (error) {
      logger.error('ActivityService', 'Error starting session', error);
    }
  }

  async endSession(sessionId: string, endTime: Date) {
    try {
      const session = await prisma.userSession.findUnique({
        where: { id: sessionId },
        select: { startTime: true },
      });

      if (!session) return;

      const duration = Math.floor(
        (endTime.getTime() - session.startTime.getTime()) / 1000
      );

      await prisma.userSession.update({
        where: { id: sessionId },
        data: {
          endTime,
          duration,
        },
      });
    } catch (error) {
      logger.error('ActivityService', 'Error ending session', error);
    }
  }

  async getUserActivities(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
      action?: string;
    }
  ) {
    try {
      const { page = 1, limit = 10, startDate, endDate, action } = options || {};

      const where: any = { userId };
      if (startDate) where.timestamp = { gte: startDate };
      if (endDate) where.timestamp = { ...where.timestamp, lte: endDate };
      if (action) where.action = action;

      const [activities, total] = await Promise.all([
        prisma.userActivity.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.userActivity.count({ where }),
      ]);

      return {
        activities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('ActivityService', 'Error getting user activities', error);
      throw error;
    }
  }

  async getUserSessions(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const { page = 1, limit = 10, startDate, endDate } = options || {};

      const where: any = { userId };
      if (startDate) where.startTime = { gte: startDate };
      if (endDate) where.startTime = { ...where.startTime, lte: endDate };

      const [sessions, total] = await Promise.all([
        prisma.userSession.findMany({
          where,
          orderBy: { startTime: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.userSession.count({ where }),
      ]);

      return {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('ActivityService', 'Error getting user sessions', error);
      throw error;
    }
  }

  async getActivityStats(userId: string) {
    try {
      const [
        totalActivities,
        lastActivity,
        sessionStats,
        popularPages,
      ] = await Promise.all([
        prisma.userActivity.count({ where: { userId } }),
        prisma.userActivity.findFirst({
          where: { userId },
          orderBy: { timestamp: 'desc' },
        }),
        prisma.userSession.aggregate({
          where: { userId },
          _avg: { duration: true },
          _count: { id: true },
        }),
        prisma.pageView.groupBy({
          by: ['path'],
          where: { userId },
          _count: { _all: true },
          orderBy: { _count: { _all: 'desc' } },
          take: 5,
        }),
      ]);

      return {
        totalActivities,
        lastActivity: lastActivity?.timestamp,
        averageSessionDuration: sessionStats._avg.duration || 0,
        totalSessions: sessionStats._count.id,
        popularPages: popularPages.map((page) => ({
          path: page.path,
          views: page._count._all,
        })),
      };
    } catch (error) {
      logger.error('ActivityService', 'Error getting activity stats', error);
      throw error;
    }
  }

  async cleanupOldActivities(retentionDays: number) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      await Promise.all([
        prisma.userActivity.deleteMany({
          where: {
            timestamp: {
              lt: cutoffDate,
            },
          },
        }),
        prisma.pageView.deleteMany({
          where: {
            timestamp: {
              lt: cutoffDate,
            },
          },
        }),
        prisma.userSession.deleteMany({
          where: {
            startTime: {
              lt: cutoffDate,
            },
          },
        }),
      ]);
    } catch (error) {
      logger.error('ActivityService', 'Error cleaning up old activities', error);
    }
  }
}

export const activityService = new ActivityService();
