// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: DefaultUser & {
      name: string | null;
      email?: string | null;
      role?: string | null;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
}
