import { Server } from 'ws';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

class WebSocketServer {
  private wss: Server;
  private clients: Map<string, WebSocketClient>;

  constructor(server: any) {
    this.wss = new Server({ server });
    this.clients = new Map();

    this.wss.on('connection', this.handleConnection.bind(this));
    
    // Set up ping interval to keep connections alive
    setInterval(() => {
      this.wss.clients.forEach((client: WebSocketClient) => {
        if (client.isAlive === false) {
          this.clients.delete(client.userId!);
          return client.terminate();
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30000);
  }

  private async handleConnection(ws: WebSocketClient) {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case 'auth':
            await this.handleAuth(ws, data.payload.token);
            break;

          case 'notification_read':
            await this.handleNotificationRead(ws, data.payload.notificationId);
            break;

          default:
            logger.warn('WebSocket', `Unknown message type: ${data.type}`);
        }
      } catch (error) {
        logger.error('WebSocket', 'Error handling message', error);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        this.clients.delete(ws.userId);
        this.broadcastUserStatus(ws.userId, 'offline');
      }
    });
  }

  private async handleAuth(ws: WebSocketClient, token: string) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
      ws.userId = decoded.userId;
      this.clients.set(decoded.userId, ws);
      
      // Broadcast user online status
      this.broadcastUserStatus(decoded.userId, 'online');
      
      // Send unread notifications
      const unreadNotifications = await prisma.notification.findMany({
        where: {
          userId: decoded.userId,
          read: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      ws.send(JSON.stringify({
        type: 'notifications_init',
        payload: unreadNotifications,
      }));
    } catch (error) {
      logger.error('WebSocket', 'Auth error', error);
      ws.close();
    }
  }

  private async handleNotificationRead(ws: WebSocketClient, notificationId: string) {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      logger.error('WebSocket', 'Error marking notification as read', error);
    }
  }

  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    const message = JSON.stringify({
      type: 'user_status',
      payload: { userId, status },
    });

    this.wss.clients.forEach((client: WebSocketClient) => {
      if (client.userId && client.userId !== userId) {
        client.send(message);
      }
    });
  }

  public async sendNotification(userId: string, notification: any) {
    try {
      // Save notification to database
      const savedNotification = await prisma.notification.create({
        data: {
          ...notification,
          userId,
        },
      });

      // Send to connected client if online
      const client = this.clients.get(userId);
      if (client) {
        client.send(JSON.stringify({
          type: 'notification',
          payload: savedNotification,
        }));
      }
    } catch (error) {
      logger.error('WebSocket', 'Error sending notification', error);
    }
  }

  public async broadcastNotification(notification: any, excludeUserId?: string) {
    this.wss.clients.forEach((client: WebSocketClient) => {
      if (client.userId && client.userId !== excludeUserId) {
        client.send(JSON.stringify({
          type: 'notification',
          payload: notification,
        }));
      }
    });
  }
}

let wsServer: WebSocketServer;

export const initWebSocketServer = (server: any) => {
  if (!wsServer) {
    wsServer = new WebSocketServer(server);
  }
  return wsServer;
};

export const getWebSocketServer = () => {
  if (!wsServer) {
    throw new Error('WebSocket server not initialized');
  }
  return wsServer;
};
