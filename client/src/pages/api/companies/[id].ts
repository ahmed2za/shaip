import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const company = await prisma.company.findUnique({
          where: { id: Number(id) },
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        });

        if (!company) {
          return res.status(404).json({ error: 'الشركة غير موجودة' });
        }

        res.status(200).json(company);
      } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء جلب معلومات الشركة' });
      }
      break;

    case 'PUT':
      // التحقق من صلاحيات المشرف
      if (!session?.user?.isAdmin) {
        return res.status(403).json({ error: 'غير مصرح بهذا الإجراء' });
      }

      try {
        const {
          name,
          logo,
          website,
          description,
          category,
          location,
          isVerified
        } = req.body;

        const company = await prisma.company.update({
          where: { id: Number(id) },
          data: {
            name,
            logo,
            website,
            description,
            category,
            location: location ? JSON.stringify(location) : null,
            isVerified,
            updatedAt: new Date(),
          },
        });

        res.status(200).json(company);
      } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث معلومات الشركة' });
      }
      break;

    case 'DELETE':
      // التحقق من صلاحيات المشرف
      if (!session?.user?.isAdmin) {
        return res.status(403).json({ error: 'غير مصرح بهذا الإجراء' });
      }

      try {
        await prisma.company.delete({
          where: { id: Number(id) },
        });

        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الشركة' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
