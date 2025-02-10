import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }

      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = token;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'تأكيد البريد الإلكتروني',
        html: `
          <div dir="rtl">
            <h1>تأكيد البريد الإلكتروني</h1>
            <p>مرحباً ${user.name}،</p>
            <p>شكراً لتسجيلك في موقعنا. يرجى النقر على الرابط التالي لتأكيد بريدك الإلكتروني:</p>
            <a href="${verificationUrl}">تأكيد البريد الإلكتروني</a>
            <p>هذا الرابط صالح لمدة 24 ساعة فقط.</p>
          </div>
        `,
      });

      res.status(200).json({ message: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إرسال رابط التأكيد' });
    }
  } else if (req.method === 'GET') {
    try {
      const { token } = req.query;
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'رابط التأكيد غير صالح أو منتهي الصلاحية' });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'تم تأكيد البريد الإلكتروني بنجاح' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء تأكيد البريد الإلكتروني' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
