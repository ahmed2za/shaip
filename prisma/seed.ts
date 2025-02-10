import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test accounts
  const testAccounts = [
    {
      email: 'admin@example.com',
      password: 'Admin@123',
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'company@example.com',
      password: 'Company@123',
      name: 'Test Company',
      role: 'COMPANY',
    },
    {
      email: 'user@example.com',
      password: 'User@123',
      name: 'Test User',
      role: 'USER',
    },
  ];

  for (const account of testAccounts) {
    const hashedPassword = await hash(account.password, 12);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        name: account.name,
        password: hashedPassword,
        role: account.role,
      },
    });
  }

  // Create categories
  const categories = [
    {
      name: 'تقنية المعلومات',
      description: 'شركات البرمجيات وتطوير التطبيقات والخدمات التقنية',
    },
    {
      name: 'التجارة الإلكترونية',
      description: 'منصات البيع والشراء عبر الإنترنت',
    },
    {
      name: 'التسويق الرقمي',
      description: 'خدمات التسويق والإعلان الرقمي',
    },
    {
      name: 'الخدمات المالية',
      description: 'البنوك وشركات التأمين والخدمات المالية',
    },
    {
      name: 'العقارات',
      description: 'شركات التطوير العقاري والوساطة العقارية',
    },
    {
      name: 'التعليم',
      description: 'المؤسسات التعليمية ومنصات التعلم الإلكتروني',
    },
    {
      name: 'الصحة والطب',
      description: 'المستشفيات والعيادات والخدمات الطبية',
    },
    {
      name: 'المطاعم والضيافة',
      description: 'المطاعم والفنادق وخدمات الضيافة',
    },
    {
      name: 'النقل والخدمات اللوجستية',
      description: 'شركات النقل والشحن والخدمات اللوجستية',
    },
    {
      name: 'البناء والمقاولات',
      description: 'شركات البناء والمقاولات والهندسة',
    },
    {
      name: 'أخرى',
      description: 'تصنيفات أخرى',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
