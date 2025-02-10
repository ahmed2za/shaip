import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { monitoringService } from '@/services/monitoringService';
import { activityService } from '@/services/activityService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const { type, startDate, endDate } = req.query;
        
        switch (type) {
          case 'metrics':
            const metrics = await monitoringService.getMetrics({
              start: new Date(startDate as string),
              end: new Date(endDate as string),
            });
            return res.status(200).json(metrics);

          case 'health':
            const health = await monitoringService.getSystemHealth();
            return res.status(200).json(health);

          case 'errors':
            const validLevels = ['error', 'info', 'warning', undefined];
            const level = req.query.level;
            if (level && !validLevels.includes(level as string)) {
              return res.status(400).json({ error: 'Invalid level parameter. Must be one of: error, info, warning' });
            }
            const errors = await monitoringService.getErrorLogs({
              startDate: startDate ? new Date(startDate as string) : undefined,
              endDate: endDate ? new Date(endDate as string) : undefined,
              page: parseInt(req.query.page as string) || 1,
              limit: parseInt(req.query.limit as string) || 10,
              level: (level as "error" | "info" | "warning" | undefined),
            });
            return res.status(200).json(errors);

          case 'activities':
            const activities = await activityService.getUserActivities(
              req.query.userId as string,
              {
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                action: req.query.action as string,
              }
            );
            return res.status(200).json(activities);

          default:
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

      case 'POST':
        if (req.body.type === 'cleanup') {
          const retentionDays = parseInt(req.body.retentionDays) || 30;
          await Promise.all([
            monitoringService.cleanup(retentionDays),
            activityService.cleanupOldActivities(retentionDays),
          ]);
          return res.status(200).json({ message: 'Cleanup completed' });
        }
        return res.status(400).json({ error: 'Invalid request type' });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Monitoring API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
