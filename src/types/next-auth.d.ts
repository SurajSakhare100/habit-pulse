import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPro?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    isPro?: boolean;
  }
}
