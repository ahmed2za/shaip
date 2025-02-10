import { getWebSocketServer } from '@/server/websocket';
import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

export interface NotificationData {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  async createNotification(userId: string, data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type: data.type,
          message: data.message,
          link: data.link,
          metadata: data.metadata,
        },
      });

      // Send real-time notification if WebSocket server is available
      try {
        const wsServer = getWebSocketServer();
        await wsServer.sendNotification(userId, notification);
      } catch (error) {
        logger.warn(
          'NotificationService',
          'WebSocket server not available for real-time notification',
          error
        );
      }

      return notification;
    } catch (error) {
      logger.error('NotificationService', 'Error creating notification', error);
      throw error;
    }
  }

  async createBroadcastNotification(data: NotificationData, excludeUserId?: string) {
    try {
      // Get all active users
      const users = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          id: {
            not: excludeUserId,
          },
        },
        select: {
          id: true,
        },
      });

      // Create notifications for all users
      const notifications = await Promise.all(
        users.map((user) =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type: data.type,
              message: data.message,
              link: data.link,
              metadata: data.metadata,
            },
          })
        )
      );

      // Broadcast to all connected users
      try {
        const wsServer = getWebSocketServer();
        await wsServer.broadcastNotification(
          {
            type: data.type,
            message: data.message,
            link: data.link,
            metadata: data.metadata,
          },
          excludeUserId
        );
      } catch (error) {
        logger.warn(
          'NotificationService',
          'WebSocket server not available for broadcast',
          error
        );
      }

      return notifications;
    } catch (error) {
      logger.error(
        'NotificationService',
        'Error creating broadcast notification',
        error
      );
      throw error;
    }
  }

  async markAsRead(notificationId: string) {
    try {
      return await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      logger.error('NotificationService', 'Error marking notification as read', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      return await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: { read: true },
      });
    } catch (error) {
      logger.error(
        'NotificationService',
        'Error marking all notifications as read',
        error
      );
      throw error;
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      return await prisma.notification.delete({
        where: { id: notificationId },
      });
    } catch (error) {
      logger.error('NotificationService', 'Error deleting notification', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
    } catch (error) {
      logger.error('NotificationService', 'Error getting unread count', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, options: {
    page?: number;
    limit?: number;
    includeRead?: boolean;
  } = {}) {
    const {
      page = 1,
      limit = 10,
      includeRead = true,
    } = options;

    try {
      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: {
            userId,
            ...(includeRead ? {} : { read: false }),
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.notification.count({
          where: {
            userId,
            ...(includeRead ? {} : { read: false }),
          },
        }),
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('NotificationService', 'Error getting user notifications', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
