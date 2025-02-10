import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    // Forward the request to the server API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'حدث خطأ أثناء تسجيل الدخول',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
