import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { createTransport } from 'nodemailer';
import { sign } from 'jsonwebtoken';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({
        message: 'إذا كان البريد الإلكتروني مسجل لدينا، سيتم إرسال رابط إعادة تعيين كلمة المرور',
      });
    }

    // Generate reset token
    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div dir="rtl">
          <h1>إعادة تعيين كلمة المرور</h1>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>إذا لم تقم بهذا الطلب، يمكنك تجاهل هذا البريد الإلكتروني.</p>
          <p>لإعادة تعيين كلمة المرور، انقر على الرابط التالي:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            إعادة تعيين كلمة المرور
          </a>
          <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      message: 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور',
    });
  }
}
