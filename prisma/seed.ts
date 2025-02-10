import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the admin password
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: {
        email: 'admin@misdaqia.com'
      }
    });

    // Create admin user
    await prisma.user.create({
      data: {
        email: 'admin@misdaqia.com',
        name: 'Admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully');

    // Create categories
    const categories = [
      {
        name: 'تقنية المعلومات',
        description: 'شركات وخدمات تكنولوجيا المعلومات والبرمجيات',
      },
      {
        name: 'التسويق الرقمي',
        description: 'خدمات التسويق الرقمي ووسائل التواصل الاجتماعي',
      },
      {
        name: 'التصميم',
        description: 'خدمات التصميم الجرافيكي وتصميم المواقع',
      },
      {
        name: 'الاستشارات',
        description: 'خدمات الاستشارات الإدارية والمالية',
      },
      {
        name: 'العقارات',
        description: 'خدمات العقارات والإسكان',
      },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }

    // Create sample companies
    const sampleCompanies = [
      {
        name: 'شركة التقنية المتقدمة',
        description: 'شركة رائدة في مجال تطوير البرمجيات وحلول تكنولوجيا المعلومات',
        logo: 'https://example.com/logo1.png',
        website: 'https://techcompany.com',
        address: 'الرياض، المملكة العربية السعودية',
        location: { lat: 24.7136, lng: 46.6753 },
        services: ['تطوير البرمجيات', 'تطبيقات الموبايل', 'الذكاء الاصطناعي'],
        workingHours: {
          sunday: '9:00 AM - 5:00 PM',
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
        },
        socialMedia: {
          twitter: 'https://twitter.com/techcompany',
          linkedin: 'https://linkedin.com/company/techcompany',
        },
        phoneNumber: '+966500000000',
        email: 'info@techcompany.com',
        foundedYear: 2020,
        featured: true,
      },
      {
        name: 'وكالة التسويق الإبداعي',
        description: 'وكالة متخصصة في التسويق الرقمي وإدارة وسائل التواصل الاجتماعي',
        logo: 'https://example.com/logo2.png',
        website: 'https://marketingagency.com',
        address: 'جدة، المملكة العربية السعودية',
        location: { lat: 21.5433, lng: 39.1728 },
        services: ['التسويق الرقمي', 'إدارة السوشيال ميديا', 'تحسين محركات البحث'],
        workingHours: {
          sunday: '10:00 AM - 6:00 PM',
          monday: '10:00 AM - 6:00 PM',
          tuesday: '10:00 AM - 6:00 PM',
          wednesday: '10:00 AM - 6:00 PM',
          thursday: '10:00 AM - 6:00 PM',
        },
        socialMedia: {
          instagram: 'https://instagram.com/marketingagency',
          facebook: 'https://facebook.com/marketingagency',
        },
        phoneNumber: '+966500000001',
        email: 'info@marketingagency.com',
        foundedYear: 2021,
        featured: true,
      },
    ];

    // Get categories for reference
    const techCategory = await prisma.category.findUnique({
      where: { name: 'تقنية المعلومات' },
    });

    const marketingCategory = await prisma.category.findUnique({
      where: { name: 'التسويق الرقمي' },
    });

    // Create companies with their respective categories
    if (techCategory && marketingCategory) {
      await prisma.company.upsert({
        where: { name: sampleCompanies[0].name },
        update: {},
        create: {
          ...sampleCompanies[0],
          categoryId: techCategory.id,
        },
      });

      await prisma.company.upsert({
        where: { name: sampleCompanies[1].name },
        update: {},
        create: {
          ...sampleCompanies[1],
          categoryId: marketingCategory.id,
        },
      });
    }

    // Create sample reviews
    const companies = await prisma.company.findMany();
    const users = await prisma.user.findMany({ where: { role: 'USER' } });

    if (companies.length > 0 && users.length > 0) {
      const sampleReviews = [
        {
          title: 'خدمة ممتازة',
          content: 'تجربة رائعة مع الشركة، فريق محترف وخدمة عملاء متميزة',
          rating: 5,
          pros: 'جودة العمل، سرعة التنفيذ، التواصل الممتاز',
          cons: 'الأسعار مرتفعة نسبياً',
          advice: 'استمروا بنفس المستوى',
          userId: users[0].id,
          companyId: companies[0].id,
        },
        {
          title: 'تجربة جيدة',
          content: 'خدمات جيدة ولكن تحتاج إلى بعض التحسينات',
          rating: 4,
          pros: 'فريق متعاون، نتائج جيدة',
          cons: 'وقت التنفيذ طويل نسبياً',
          advice: 'تحسين وقت التنفيذ',
          userId: users[0].id,
          companyId: companies[1].id,
        },
      ];

      for (const review of sampleReviews) {
        await prisma.review.create({
          data: review,
        });
      }
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error in seed:', error);
    throw error;
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
