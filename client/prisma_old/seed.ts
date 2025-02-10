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

  console.log('Creating test accounts...');

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
    console.log(`Created/Updated account for ${account.email}`);
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
