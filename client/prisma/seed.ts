import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@misdaqia.com' },
    update: {},
    create: {
      email: 'admin@misdaqia.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular users
  const users = [
    {
      name: 'محمد أحمد',
      email: 'mohammed@example.com',
    },
    {
      name: 'سارة خالد',
      email: 'sarah@example.com',
    },
    {
      name: 'عبدالله محمد',
      email: 'abdullah@example.com',
    },
  ];

  for (const user of users) {
    const password = await hash('password123', 12);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password,
        role: 'USER',
      },
    });
  }

  // Create sample companies
  const companies = [
    {
      name: 'شركة الاتصالات السعودية',
      description: 'شركة رائدة في مجال الاتصالات وتقنية المعلومات في المملكة العربية السعودية',
      logo: '/images/stc-logo.png',
      website: 'https://www.stc.com.sa',
      address: 'الرياض، المملكة العربية السعودية',
      location: { city: 'الرياض', country: 'المملكة العربية السعودية' },
      services: ['خدمات الاتصالات', 'الإنترنت', 'التلفاز الرقمي'],
      category: 'الاتصالات',
      workingHours: {
        sunday: '8:00 AM - 5:00 PM',
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
      },
      socialMedia: {
        twitter: 'https://twitter.com/stc',
        linkedin: 'https://linkedin.com/company/stc',
      },
      phoneNumber: '+966114444444',
      email: 'care@stc.com.sa',
      foundedYear: 1998,
      featured: true,
    },
    {
      name: 'أرامكو السعودية',
      description: 'شركة النفط الوطنية السعودية وأكبر شركة نفط في العالم',
      logo: '/images/aramco-logo.png',
      website: 'https://www.aramco.com',
      address: 'الظهران، المملكة العربية السعودية',
      location: { city: 'الظهران', country: 'المملكة العربية السعودية' },
      services: ['استكشاف النفط', 'إنتاج النفط', 'تكرير النفط'],
      category: 'النفط والطاقة',
      workingHours: {
        sunday: '7:00 AM - 4:00 PM',
        monday: '7:00 AM - 4:00 PM',
        tuesday: '7:00 AM - 4:00 PM',
        wednesday: '7:00 AM - 4:00 PM',
        thursday: '7:00 AM - 4:00 PM',
      },
      socialMedia: {
        twitter: 'https://twitter.com/aramco',
        linkedin: 'https://linkedin.com/company/aramco',
      },
      phoneNumber: '+966138872222',
      email: 'webmaster@aramco.com',
      foundedYear: 1933,
      featured: true,
    },
  ];

  for (const company of companies) {
    try {
      // First try to find if company exists
      const existingCompany = await prisma.company.findFirst({
        where: {
          name: company.name
        }
      });

      if (!existingCompany) {
        await prisma.company.create({
          data: company
        });
      }
    } catch (error) {
      console.error(`Error creating company ${company.name}:`, error);
    }
  }

  // Add sample reviews
  const allCompanies = await prisma.company.findMany();
  const allUsers = await prisma.user.findMany({ where: { role: 'USER' } });

  const reviewTemplates = [
    {
      title: 'تجربة رائعة مع الشركة',
      content: 'كانت تجربتي مع الشركة ممتازة من جميع النواحي',
      pros: 'بيئة عمل محفزة، رواتب جيدة، فرص تطور',
      cons: 'ساعات عمل طويلة',
      advice: 'الاهتمام بالتوازن بين العمل والحياة',
      helpfulCount: Math.floor(Math.random() * 50),
      rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3 and 5
    },
    {
      title: 'شركة متميزة في مجالها',
      content: 'شركة رائدة في مجالها وتقدم خدمات عالية الجودة',
      pros: 'سمعة ممتازة، خدمة عملاء متميزة',
      cons: 'أسعار مرتفعة نسبياً',
      advice: 'تقديم خيارات أسعار أكثر مرونة',
      helpfulCount: Math.floor(Math.random() * 50),
      rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3 and 5
    },
  ];

  for (const company of allCompanies) {
    for (const user of allUsers) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      await prisma.review.create({
        data: {
          ...template,
          userId: user.id,
          companyId: company.id,
        },
      });
    }
  }

  // Add sample advertisements
  const advertisements = [
    {
      title: 'إعلان الصفحة الرئيسية',
      description: 'إعلان مميز في أعلى الصفحة الرئيسية',
      imageUrl: '/ads/home-banner.jpg',
      link: 'https://example.com/promo',
      position: 'home_top',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
    {
      title: 'إعلان الشريط الجانبي',
      description: 'إعلان في الشريط الجانبي لصفحات الشركات',
      imageUrl: '/ads/sidebar-banner.jpg',
      link: 'https://example.com/offer',
      position: 'sidebar',
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isActive: true,
    },
  ];

  for (const ad of advertisements) {
    try {
      await prisma.advertisement.create({
        data: ad,
      });
    } catch (error) {
      console.error(`Error creating advertisement ${ad.title}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
