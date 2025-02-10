import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';
import os from 'os';
import { performance } from 'perf_hooks';

export interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
  uptime: number;
  activeConnections: number;
  requestsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface ErrorLog {
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

class MonitoringService {
  private metricsInterval: NodeJS.Timer | null = null;
  private readonly metrics: SystemMetrics[] = [];
  private readonly errorLogs: ErrorLog[] = [];
  private readonly maxMetricsLength = 1440; // Store 24 hours of metrics (1 per minute)
  private readonly maxErrorLogsLength = 1000;

  startMonitoring(interval = 60000) { // Default to 1 minute
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.metricsInterval = setInterval(async () => {
      const metrics = await this.collectMetrics();
      this.addMetrics(metrics);
      await this.saveMetrics(metrics);
    }, interval);
  }

  stopMonitoring() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  private async collectMetrics(): Promise<SystemMetrics> {
    const cpus = os.cpus();
    const totalCpuTime = cpus.reduce((acc, cpu) => {
      return (
        acc +
        cpu.times.user +
        cpu.times.nice +
        cpu.times.sys +
        cpu.times.idle +
        cpu.times.irq
      );
    }, 0);
    const idleCpuTime = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const cpuUsage = ((totalCpuTime - idleCpuTime) / totalCpuTime) * 100;

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Get active connections and requests per minute from the database
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const [activeConnections, recentRequests, errors] = await Promise.all([
      prisma.userSession.count({
        where: {
          endTime: null,
        },
      }),
      prisma.apiRequest.count({
        where: {
          timestamp: {
            gte: oneMinuteAgo,
          },
        },
      }),
      prisma.errorLog.count({
        where: {
          timestamp: {
            gte: oneMinuteAgo,
          },
        },
      }),
    ]);

    // Calculate average response time
    const recentResponses = await prisma.apiRequest.findMany({
      where: {
        timestamp: {
          gte: oneMinuteAgo,
        },
      },
      select: {
        duration: true,
      },
    });

    const averageResponseTime =
      recentResponses.reduce((acc, req) => acc + (req.duration || 0), 0) /
      (recentResponses.length || 1);

    return {
      timestamp: new Date(),
      cpuUsage,
      memoryUsage: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
      },
      uptime: os.uptime(),
      activeConnections,
      requestsPerMinute: recentRequests,
      averageResponseTime,
      errorRate: (errors / (recentRequests || 1)) * 100,
    };
  }

  private addMetrics(metrics: SystemMetrics) {
    this.metrics.push(metrics);
    if (this.metrics.length > this.maxMetricsLength) {
      this.metrics.shift();
    }
  }

  private async saveMetrics(metrics: SystemMetrics) {
    try {
      await prisma.systemMetrics.create({
        data: {
          timestamp: metrics.timestamp,
          cpuUsage: metrics.cpuUsage,
          memoryTotal: metrics.memoryUsage.total,
          memoryUsed: metrics.memoryUsage.used,
          memoryFree: metrics.memoryUsage.free,
          uptime: metrics.uptime,
          activeConnections: metrics.activeConnections,
          requestsPerMinute: metrics.requestsPerMinute,
          averageResponseTime: metrics.averageResponseTime,
          errorRate: metrics.errorRate,
        },
      });
    } catch (error) {
      logger.error('MonitoringService', 'Error saving metrics', error);
    }
  }

  async logError(error: Error, context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context,
    };

    this.errorLogs.push(errorLog);
    if (this.errorLogs.length > this.maxErrorLogsLength) {
      this.errorLogs.shift();
    }

    try {
      await prisma.errorLog.create({
        data: {
          timestamp: errorLog.timestamp,
          level: errorLog.level,
          message: errorLog.message,
          stack: errorLog.stack,
          context: errorLog.context,
        },
      });
    } catch (error) {
      logger.error('MonitoringService', 'Error saving error log', error);
    }
  }

  async getMetrics(timeRange: { start: Date; end: Date }) {
    try {
      return await prisma.systemMetrics.findMany({
        where: {
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });
    } catch (error) {
      logger.error('MonitoringService', 'Error getting metrics', error);
      throw error;
    }
  }

  async getErrorLogs(
    options?: {
      page?: number;
      limit?: number;
      level?: 'error' | 'warning' | 'info';
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const { page = 1, limit = 50, level, startDate, endDate } = options || {};

      const where: any = {};
      if (level) where.level = level;
      if (startDate) where.timestamp = { gte: startDate };
      if (endDate) where.timestamp = { ...where.timestamp, lte: endDate };

      const [logs, total] = await Promise.all([
        prisma.errorLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.errorLog.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('MonitoringService', 'Error getting error logs', error);
      throw error;
    }
  }

  async getSystemHealth() {
    try {
      const metrics = await this.collectMetrics();
      const lastHour = new Date(Date.now() - 3600000);
      
      const [
        errorCount,
        averageResponseTime,
        successRate,
      ] = await Promise.all([
        prisma.errorLog.count({
          where: {
            timestamp: {
              gte: lastHour,
            },
          },
        }),
        prisma.apiRequest.aggregate({
          where: {
            timestamp: {
              gte: lastHour,
            },
          },
          _avg: {
            duration: true,
          },
        }),
        prisma.apiRequest.groupBy({
          by: ['status'],
          where: {
            timestamp: {
              gte: lastHour,
            },
          },
          _count: true,
        }),
      ]);

      const totalRequests = successRate.reduce(
        (acc, curr) => acc + curr._count,
        0
      );
      const successfulRequests = successRate.find(
        (r) => r.status >= 200 && r.status < 300
      )?._count || 0;

      return {
        status:
          metrics.cpuUsage < 80 &&
          metrics.memoryUsage.used / metrics.memoryUsage.total < 0.8 &&
          metrics.errorRate < 5
            ? 'healthy'
            : 'degraded',
        metrics,
        lastHour: {
          errorCount,
          averageResponseTime: averageResponseTime._avg.duration || 0,
          successRate: (successfulRequests / totalRequests) * 100,
        },
      };
    } catch (error) {
      logger.error('MonitoringService', 'Error getting system health', error);
      throw error;
    }
  }

  async cleanup(retentionDays: number) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      await Promise.all([
        prisma.systemMetrics.deleteMany({
          where: {
            timestamp: {
              lt: cutoffDate,
            },
          },
        }),
        prisma.errorLog.deleteMany({
          where: {
            timestamp: {
              lt: cutoffDate,
            },
          },
        }),
      ]);
    } catch (error) {
      logger.error('MonitoringService', 'Error cleaning up old data', error);
    }
  }
}

export const monitoringService = new MonitoringService();
