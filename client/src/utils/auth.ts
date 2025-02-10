import { supabase } from '@/lib/supabase'
import { useSession, signIn as nextAuthSignIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { NextPage } from 'next';
import type { ComponentType } from 'react';
import type { Session } from 'next-auth';
import React from 'react';

export type UserRole = 'ADMIN' | 'COMPANY' | 'USER';
export type Gender = 'male' | 'female';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: Gender;
  avatar?: string;
}

export interface WithAuthProps {
  isAuthenticated?: boolean;
  loading?: boolean;
  session?: Session | null;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'USER',
  gender?: Gender
): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
            gender,
          },
        ]);

      if (profileError) throw profileError;

      return {
        user: {
          id: data.user.id,
          name,
          email,
          role,
          gender,
        },
        error: null,
      };
    }

    return { user: null, error: new Error('User creation failed') };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: userData as User,
        error: null,
      };
    }

    return { user: null, error: new Error('Sign in failed') };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export function withAuth<P extends WithAuthProps = WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
  } = {}
) {
  const { requireAuth = true, requireAdmin = false, redirectTo = '/auth/signin' } = options;

  const WithAuthWrapper: NextPage<P> = (props) => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !session) {
          nextAuthSignIn();
        } else if (requireAdmin && session?.user?.role !== 'ADMIN') {
          router.replace('/404');
        }
      }
    }, [loading, session, router]);

    if (loading) {
      return React.createElement('div', null, 'Loading...');
    }

    if (requireAuth && !session) {
      return null;
    }

    if (requireAdmin && session?.user?.role !== 'ADMIN') {
      return null;
    }

    return React.createElement(
      WrappedComponent,
      {
        ...props as P,
        isAuthenticated: !!session,
        loading,
        session,
      }
    );
  };

  WithAuthWrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuthWrapper;
}
