import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import type { Company } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id || session.user.role !== 'COMPANY') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const companyData = req.body as Partial<Company>;

    // Find the company associated with the user
    const company = await prisma.company.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update company information
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: companyData.name,
        description: companyData.description,
        logo: companyData.logo,
        website: companyData.website,
        address: companyData.address,
        location: companyData.location,
        services: companyData.services,
        category: companyData.category,
        workingHours: companyData.workingHours,
        socialMedia: companyData.socialMedia,
        phoneNumber: companyData.phoneNumber,
        email: companyData.email,
        foundedYear: companyData.foundedYear,
      },
    });

    return res.status(200).json({ company: updatedCompany });
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
