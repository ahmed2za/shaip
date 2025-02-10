import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: 'يجب توفير رمز إعادة التعيين وكلمة المرور الجديدة',
      });
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      email: string;
    };

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور',
    });
  }
}
