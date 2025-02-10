import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';

// Validation schemas
const companyDetailsSchema = z.object({
  name: z.string().min(2, 'اسم الشركة يجب أن يكون أكثر من حرفين'),
  website: z.string().url('الرجاء إدخال رابط صحيح').optional().nullable(),
  categoryId: z.string().min(2, 'الرجاء اختيار تصنيف').optional().nullable(),
});

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل'
    ),
  userType: z.enum(['user', 'company']),
  companyDetails: z.union([companyDetailsSchema, z.null()]).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    const { email, password, userType, companyDetails } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: userType === 'company' ? 'COMPANY' : 'USER',
        },
      });

      // If user is a company, create company profile
      if (userType === 'company' && companyDetails) {
        // Check if company name exists
        const existingCompany = await prisma.company.findUnique({
          where: { name: companyDetails.name },
        });

        if (existingCompany) {
          await prisma.user.delete({
            where: { id: user.id },
          });
          return res.status(400).json({
            message: 'اسم الشركة مسجل مسبقاً',
          });
        }

        await prisma.company.create({
          data: {
            name: companyDetails.name,
            website: companyDetails.website || null,
            categoryId: companyDetails.categoryId || null,
            userId: user.id,
          },
        });
      }

      return user;
    });

    return res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'خطأ في البيانات المدخلة',
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
  }
}
