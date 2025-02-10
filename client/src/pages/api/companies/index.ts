import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  switch (req.method) {
    case 'GET':
      try {
        const companies = await prisma.company.findMany({
          include: {
            reviews: true,
          },
        });
        res.status(200).json(companies);
      } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الشركات' });
      }
      break;

    case 'POST':
      // التحقق من تسجيل الدخول
      if (!session) {
        return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });
      }

      try {
        const {
          name,
          logo,
          website,
          description,
          category,
          location
        } = req.body;

        const company = await prisma.company.create({
          data: {
            name,
            logo,
            website,
            description,
            category,
            location: location ? JSON.stringify(location) : null,
            createdBy: session.user.id,
          },
        });

        res.status(201).json(company);
      } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء إضافة الشركة' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
