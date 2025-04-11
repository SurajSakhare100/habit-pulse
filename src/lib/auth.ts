import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import User from "@/models/User";
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) throw new Error("Credentials are missing");
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) throw new Error("Invalid credentials");

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isCorrectPassword) throw new Error("Invalid credentials");

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          isPro: user.isPro || false
        };
      },
    }),

  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          // If user doesn't exist in the database, create one
          await UserModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
            isVerified: true,
            emailVerified: new Date(),
            authProvider: 'google', // Google authentication provider
            isPro: false // Default to free tier
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      try {
        await dbConnect();
        // If user object is available (during sign in), add isPro to token
        if (user) {
          token.isPro = user.isPro;
        }
        
        // Always fetch latest user data
        const dbUser = await UserModel.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.isPro = dbUser.isPro || false;
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          isPro: Boolean(token.isPro)
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
