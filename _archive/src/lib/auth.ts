import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import { User } from "@/models";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        const defaultAdminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
        const defaultAdminPassword = process.env.ADMIN_PASSWORD || "adminpassword123";

        // Connect to database
        await connectToDatabase();

        // Check if admin user exists in DB
        let user = await User.findOne({ email });

        // Auto-seed initial admin user if DB has no users and credentials match default env
        if (!user && email === defaultAdminEmail) {
          const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
          user = await User.create({
            email: defaultAdminEmail,
            password: hashedPassword,
            name: "Portfolio Admin",
            role: "admin",
          });
        }

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          // Check fallback for direct env match if password was reset
          if (email === defaultAdminEmail && password === defaultAdminPassword) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        (session.user as unknown as { id?: string; role?: string }).id = token.id as string;
        (session.user as unknown as { role?: string }).role = (token.role as string) || "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "portfolio_development_secret_key_123456789",
};
