import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth';
import { User, Profile } from '@/types/user';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setProfile({
          id: userData.id,
          user_id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          avatar_url: userData.avatar,
          gender: userData.gender as 'ذكر' | 'أنثى',
          role: userData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      setProfile({
        id: user.id,
        user_id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatar_url: user.avatar,
        gender: user.gender as 'ذكر' | 'أنثى',
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      // تم إزالة إعادة التوجيه التلقائي
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      // تم إزالة إعادة التوجيه التلقائي
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      const { user } = await authService.register({
        email,
        password,
        name: userData.name || '',
        gender: userData.gender || 'ذكر',
        avatar: userData.avatar || '',
      });
      setUser(user);
      setProfile({
        id: user.id,
        user_id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatar_url: user.avatar,
        gender: user.gender as 'ذكر' | 'أنثى',
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...userData,
      });
      // تم إزالة إعادة التوجيه التلقائي
      return user;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) throw new Error('No user logged in');
    try {
      // TODO: Implement API call to update profile
      setProfile({ ...profile, ...updates });
      return profile;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    login,
    logout,
    signup,
    updateProfile,
  };
}
