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
    const { name, email, password, companyName, description } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await hash(password, 12);

    const { data, error } = await signUp(email, hashedPassword, 'COMPANY', name);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create company profile
    const { error: companyError } = await supabase
      .from('companies')
      .insert([
        {
          user_id: data.user?.id,
          name: companyName,
          description,
        },
      ]);

    if (companyError) {
      return res.status(400).json({ message: companyError.message });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user?.id,
          name,
          role: 'COMPANY',
          is_admin: false,
        },
      ]);

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(201).json({ message: 'Company registered successfully' });
  } catch (error) {
    console.error('Error registering company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
