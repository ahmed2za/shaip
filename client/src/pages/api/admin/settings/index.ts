import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const settings = await prisma.systemSettings.findFirst();
      res.status(200).json(settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        siteName,
        siteDescription,
        contactEmail,
        phoneNumber,
        address,
        socialLinks,
        userRegistrationEnabled,
        reviewModeration,
        minReviewLength,
        maxReviewLength,
        allowUserAvatars,
        defaultLanguage,
        maintenanceMode,
        maintenanceMessage,
        analyticsEnabled,
        analyticsId,
        theme,
      } = req.body;

      const settings = await prisma.systemSettings.upsert({
        where: { id: 1 },
        update: {
          siteName,
          siteDescription,
          contactEmail,
          phoneNumber,
          address,
          socialLinks,
          userRegistrationEnabled,
          reviewModeration,
          minReviewLength,
          maxReviewLength,
          allowUserAvatars,
          defaultLanguage,
          maintenanceMode,
          maintenanceMessage,
          analyticsEnabled,
          analyticsId,
          theme,
          updatedAt: new Date(),
        },
        create: {
          id: 1,
          siteName,
          siteDescription,
          contactEmail,
          phoneNumber,
          address,
          socialLinks,
          userRegistrationEnabled,
          reviewModeration,
          minReviewLength,
          maxReviewLength,
          allowUserAvatars,
          defaultLanguage,
          maintenanceMode,
          maintenanceMessage,
          analyticsEnabled,
          analyticsId,
          theme,
        },
      });

      res.status(200).json(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
