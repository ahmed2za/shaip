import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    const { data: adminAuthData, error: adminAuthError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'Admin@123',
      options: {
        data: {
          name: 'Admin User',
          role: 'admin',
        },
      },
    });

    if (adminAuthError) throw adminAuthError;

    // Create admin profile
    const { error: adminProfileError } = await supabase.from('users').insert({
      id: adminAuthData.user!.id,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString(),
      total_reviews: 0,
      total_likes: 0,
      total_helpful: 0,
    });

    if (adminProfileError) throw adminProfileError;

    console.log('Admin user created successfully');

    // Create company user
    const { data: companyAuthData, error: companyAuthError } = await supabase.auth.signUp({
      email: 'company@example.com',
      password: 'Company@123',
      options: {
        data: {
          name: 'Company User',
          role: 'company',
        },
      },
    });

    if (companyAuthError) throw companyAuthError;

    // Create company profile
    const { error: companyProfileError } = await supabase.from('users').insert({
      id: companyAuthData.user!.id,
      email: 'company@example.com',
      name: 'Company User',
      role: 'company',
      created_at: new Date().toISOString(),
      total_reviews: 0,
      total_likes: 0,
      total_helpful: 0,
    });

    if (companyProfileError) throw companyProfileError;

    // Create company details
    const { error: companyError } = await supabase.from('companies').insert({
      user_id: companyAuthData.user!.id,
      name: 'Demo Company',
      phone: '+966500000000',
      location: 'Riyadh, Saudi Arabia',
      description: 'This is a demo company account',
      website: 'https://example.com',
      category: 'restaurants',
      status: 'approved',
      created_at: new Date().toISOString(),
    });

    if (companyError) throw companyError;

    console.log('Company user created successfully');

    // Create regular user
    const { data: userAuthData, error: userAuthError } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'User@123',
      options: {
        data: {
          name: 'Regular User',
          role: 'user',
        },
      },
    });

    if (userAuthError) throw userAuthError;

    // Create user profile
    const { error: userProfileError } = await supabase.from('users').insert({
      id: userAuthData.user!.id,
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      created_at: new Date().toISOString(),
      total_reviews: 0,
      total_likes: 0,
      total_helpful: 0,
    });

    if (userProfileError) throw userProfileError;

    console.log('Regular user created successfully');

    // Create initial permissions
    const { error: permissionsError } = await supabase.from('permissions').insert([
      {
        role: 'admin',
        resource: '*',
        action: '*',
        created_at: new Date().toISOString(),
      },
      {
        role: 'company',
        resource: 'company_profile',
        action: 'write',
        created_at: new Date().toISOString(),
      },
      {
        role: 'company',
        resource: 'reviews',
        action: 'respond',
        created_at: new Date().toISOString(),
      },
      {
        role: 'user',
        resource: 'reviews',
        action: 'write',
        created_at: new Date().toISOString(),
      },
      {
        role: 'user',
        resource: 'user_profile',
        action: 'write',
        created_at: new Date().toISOString(),
      },
    ]);

    if (permissionsError) throw permissionsError;

    console.log('Permissions created successfully');
    console.log('Database seeding completed successfully!');

  } catch (error: any) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
