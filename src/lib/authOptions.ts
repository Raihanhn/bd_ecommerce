// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🟡 authorize() called");

        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials");

        console.log("❌ Missing credentials");

        await dbConnect();
        console.log("🟢 DB connected");
        const user = await User.findOne({ email: credentials.email });

        console.log("➡ Email entered:", credentials.email);
        console.log("➡ User found:", user ? "YES" : "NO");

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        // if (!isValid) throw new Error("Invalid credentials");

        if (!isValid) {
          console.log("❌ WRONG PASSWORD");
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
  ],

  pages: { signIn: "/auth/login" },

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

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

    // ✅ Make sure JWT always carries `role`
    async jwt({ token, user }) {
      await dbConnect();

      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser?._id.toString() || user.id;
        token.role = dbUser?.role || (user as any).role || "user";
      }

      return token;
    },

    // ✅ Make sure session includes the correct role
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET!,
};
