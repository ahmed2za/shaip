import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

const companyImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Modern building
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // Tech office
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // Store
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80', // Modern retail
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', // Service office
];

const articleImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Business meeting
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // Tech workspace
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', // Handshake
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // Modern workplace
  'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&q=80', // Business growth
];

const sampleCompanies = [
  {
    name: 'شركة التقنية المتقدمة',
    description: 'شركة رائدة في مجال تطوير البرمجيات وحلول تقنية المعلومات',
    category: 'تقنية المعلومات',
    logo: companyImages[0],
    coverImage: companyImages[1],
    location: 'الرياض',
    rating: 4.5,
    reviewsCount: 128,
    isVerified: true,
    website: 'techcompany.sa',
  },
  {
    name: 'متجر الإلكترونيات الحديثة',
    description: 'متجر متخصص في بيع أحدث الأجهزة الإلكترونية والهواتف الذكية',
    category: 'تجارة إلكترونية',
    logo: companyImages[2],
    coverImage: companyImages[3],
    location: 'جدة',
    rating: 4.2,
    reviewsCount: 85,
    isVerified: true,
    website: 'modernelectronics.sa',
  },
  {
    name: 'مركز الخدمات المتكاملة',
    description: 'نقدم خدمات متكاملة للشركات والأفراد بأعلى معايير الجودة',
    category: 'خدمات',
    logo: companyImages[4],
    coverImage: companyImages[0],
    location: 'الدمام',
    rating: 4.0,
    reviewsCount: 62,
    isVerified: false,
    website: 'services-center.sa',
  },
];

const sampleArticles = [
  {
    title: 'كيف تختار الشركة المناسبة لمشروعك؟',
    content: 'نقدم لكم في هذا المقال أهم النصائح لاختيار الشركة المناسبة...',
    image: articleImages[0],
    slug: 'how-to-choose-right-company',
    status: 'published',
  },
  {
    title: 'أفضل الممارسات في تقييم الشركات',
    content: 'تعرف على أفضل الممارسات في تقييم الشركات وكيفية كتابة تقييم موضوعي...',
    image: articleImages[1],
    slug: 'best-practices-company-reviews',
    status: 'published',
  },
  {
    title: 'مستقبل التجارة الإلكترونية في المملكة',
    content: 'نظرة على مستقبل التجارة الإلكترونية في المملكة العربية السعودية...',
    image: articleImages[2],
    slug: 'future-of-ecommerce',
    status: 'published',
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not allowed in production' });
  }

  try {
    // Seed companies
    for (const company of sampleCompanies) {
      await prisma.company.create({
        data: {
          ...company,
          location: {
            create: {
              name: company.location,
            },
          },
        },
      });
    }

    // Seed articles
    for (const article of sampleArticles) {
      await prisma.blogPost.create({
        data: article,
      });
    }

    res.status(200).json({ message: 'Seeding completed successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Error seeding database' });
  }
}
