import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Track the visit in the database
    await prisma.companyVisit.create({
      data: {
        companyId,
        visitedAt: new Date(),
      },
    });

    return res.status(200).json({ message: 'Visit tracked successfully' });
  } catch (error) {
    console.error('Error tracking company visit:', error);
    return res.status(500).json({ message: 'Error tracking company visit' });
  }
}
