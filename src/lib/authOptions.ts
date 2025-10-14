// Configures NextAuth for Google OAuth and email/password login with MongoDB integration.
// Handles user creation, validation, and secure JWT-based session management.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔹 Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔹 Email & Password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found");

        const valid = await bcrypt.compare(credentials!.password!, user.password);
        if (!valid) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],

  // 🔹 Custom sign-in page
  pages: { signIn: "/auth/login" },

  // 🔹 Callbacks for custom logic
  callbacks: {
    // 🧠 Runs whenever a user signs in (any provider)
    async signIn({ user, account }) {
      await dbConnect();

      // If Google login, create user in DB if not exists
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
          });
        }
      }
      return true;
    },

    // 🧠 Controls what data is stored in the session
    async session({ session, token }) {
      if (token.sub) (session as any).userId = token.sub;
      return session;
    },
  },

  // 🔹 Use JWT-based sessions (no database session storage)
  session: { strategy: "jwt" },

  // 🔹 Secret for token encryption
  secret: process.env.NEXTAUTH_SECRET!,
};
