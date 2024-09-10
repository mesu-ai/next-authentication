import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 Day
  },
  pages: {
    signIn: '/login',
  },
  providers:[]
} satisfies NextAuthConfig;