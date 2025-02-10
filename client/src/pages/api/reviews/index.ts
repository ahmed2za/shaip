import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/upload';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const reviewSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5),
  companyId: z.string().cuid(),
  images: z.array(z.string()).optional(),
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const data = reviewSchema.parse(req.body);
      
      // Handle image uploads if present
      let imageUrls: string[] = [];
      if (data.images?.length) {
        imageUrls = await Promise.all(
          data.images.map((base64Image, index) => uploadFile(base64ToFile(base64Image, `image-${index}.png`)))
        );
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          title: data.title,
          content: data.content,
          rating: data.rating,
          images: imageUrls,
          userId: session.user.id,
          companyId: data.companyId,
        },
      });

      // Update company average rating and total reviews
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const companyReviews = await tx.review.findMany({
          where: { companyId: data.companyId },
          select: { rating: true },
        });

        const totalRatingSum = companyReviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0);
        const averageRating = totalRatingSum / companyReviews.length;

        await tx.company.update({
          where: { id: data.companyId },
          data: {
            averageRating,
            totalReviews: companyReviews.length,
          },
        });
      });

      return res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { companyId, limit = '10', offset = '0', status } = req.query;

      const reviews = await prisma.review.findMany({
        where: {
          companyId: companyId as string,
          status: status as string || undefined,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          replies: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function base64ToFile(base64String: string, filename: string): File {
  const byteCharacters = atob(base64String.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: 'image/png' });
}
