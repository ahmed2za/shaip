import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signUp } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await hash(password, 12);

    const { data, error } = await signUp(email, hashedPassword, 'USER', name);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user?.id,
          name,
          role: 'USER',
          is_admin: false,
        },
      ]);

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
