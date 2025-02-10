import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const form = formidable({ multiples: true });
    
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const companyId = fields.companyId?.[0];
    const title = fields.title?.[0];
    const content = fields.content?.[0];
    const rating = fields.rating?.[0];

    if (!companyId || !title || !content || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upload images to Cloudinary if present
    const imageUrls = [];
    if (files.images) {
      const images = Array.isArray(files.images) ? files.images : [files.images];
      for (const file of images) {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'reviews',
        });
        imageUrls.push(result.secure_url);
        // Clean up temp file
        fs.unlinkSync(file.filepath);
      }
    }

    // Create review in database
    const review = await prisma.review.create({
      data: {
        title: String(title),
        content: String(content),
        rating: Number(rating),
        images: imageUrls,
        userId: session.user.id,
        companyId: String(companyId),
      },
    });

    // Update company rating
    const companyReviews = await prisma.review.findMany({
      where: { companyId: String(companyId) },
      select: { rating: true },
    });

    const averageRating = companyReviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / companyReviews.length;

    await prisma.company.update({
      where: { id: String(companyId) },
      data: {
        rating: averageRating,
        reviewsCount: companyReviews.length,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
}
