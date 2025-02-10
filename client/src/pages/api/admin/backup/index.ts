import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Get all data from main tables
      const [users, companies, reviews, comments] = await Promise.all([
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            isVerified: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.company.findMany({
          include: {
            categories: true,
            location: true,
          },
        }),
        prisma.review.findMany({
          include: {
            ratings: true,
          },
        }),
        prisma.comment.findMany(),
      ]);

      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          users,
          companies,
          reviews,
          comments,
        },
      };

      // Send backup as downloadable JSON
      res.setHeader('Content-Disposition', `attachment; filename=backup-${new Date().toISOString().split('T')[0]}.json`);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(backup);
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ error: 'Failed to create backup' });
    }
  } else if (req.method === 'PUT') {
    try {
      const backup = req.body;

      if (!backup || !backup.data) {
        return res.status(400).json({ error: 'Invalid backup data' });
      }

      // Start a transaction
      await prisma.$transaction(async (tx) => {
        // Clear existing data
        await tx.comment.deleteMany();
        await tx.review.deleteMany();
        await tx.company.deleteMany();
        await tx.user.deleteMany({ where: { role: { not: 'ADMIN' } } }); // Preserve admin users

        // Restore users (excluding admins)
        const nonAdminUsers = backup.data.users.filter((user: any) => user.role !== 'ADMIN');
        if (nonAdminUsers.length > 0) {
          await tx.user.createMany({
            data: nonAdminUsers,
            skipDuplicates: true,
          });
        }

        // Restore companies
        if (backup.data.companies.length > 0) {
          await tx.company.createMany({
            data: backup.data.companies.map((company: any) => ({
              ...company,
              categories: undefined,
              location: undefined,
            })),
            skipDuplicates: true,
          });

          // Restore company relationships
          for (const company of backup.data.companies) {
            if (company.categories?.length > 0) {
              await tx.company.update({
                where: { id: company.id },
                data: {
                  categories: {
                    connect: company.categories.map((cat: any) => ({ id: cat.id })),
                  },
                },
              });
            }
            if (company.location) {
              await tx.company.update({
                where: { id: company.id },
                data: {
                  location: {
                    create: company.location,
                  },
                },
              });
            }
          }
        }

        // Restore reviews
        if (backup.data.reviews.length > 0) {
          await tx.review.createMany({
            data: backup.data.reviews.map((review: any) => ({
              ...review,
              ratings: undefined,
            })),
            skipDuplicates: true,
          });

          // Restore review ratings
          for (const review of backup.data.reviews) {
            if (review.ratings?.length > 0) {
              await tx.review.update({
                where: { id: review.id },
                data: {
                  ratings: {
                    createMany: {
                      data: review.ratings,
                    },
                  },
                },
              });
            }
          }
        }

        // Restore comments
        if (backup.data.comments.length > 0) {
          await tx.comment.createMany({
            data: backup.data.comments,
            skipDuplicates: true,
          });
        }
      });

      res.status(200).json({ message: 'Backup restored successfully' });
    } catch (error) {
      console.error('Restore error:', error);
      res.status(500).json({ error: 'Failed to restore backup' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
