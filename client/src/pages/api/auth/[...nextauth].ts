import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

interface ExtendedToken extends JWT {
  id?: string;
  role?: 'ADMIN' | 'COMPANY' | 'USER';
}

// Extend NextAuth session and user types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'ADMIN' | 'COMPANY' | 'USER'
      provider?: string
    };
  }

  interface User {
    id: string;
    role: 'ADMIN' | 'COMPANY' | 'USER';
    provider?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          provider: 'google',
          role: 'USER',
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          provider: 'facebook',
          role: 'USER',
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || '',
      clientSecret: process.env.APPLE_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true
          }
        });

        if (!user || !user.password) {
          throw new Error('البريد الإلكتروني غير مسجل');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('كلمة المرور غير صحيحة');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
