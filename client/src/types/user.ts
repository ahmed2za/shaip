export interface User {
  id: string;
  email: string;
  role: string;
  user_metadata?: Record<string, any>;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar: string;
  avatar_url: string;
  gender: 'ذكر' | 'أنثى';
  role: string;
  created_at: string;
  updated_at: string;
}
