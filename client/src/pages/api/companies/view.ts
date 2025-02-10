import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyId } = req.body;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Upsert the company view
    await prisma.companyView.upsert({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        companyId,
        viewedAt: new Date(),
      },
    });

    return res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('Error recording company view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
