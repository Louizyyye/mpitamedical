// src/lib/api.ts (continued)
    update: (id: string, appointmentData: any) => {
      return fetchWrapper(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      }).catch(error => {
        console.error('Error updating appointment:', error);
        throw error;
      });
    },
    delete: (id: string) => {
      return fetchWrapper(`/appointments/${id}`, {
        method: 'DELETE',
      }).catch(error => {
        console.error('Error deleting appointment:', error);
        throw error;
      });
    },
  },
  records: {
    getAll: () => fetchWrapper('/records'),
    getById: (id: string) => fetchWrapper(`/records/${id}`),
    create: (recordData: any) => {
      return fetchWrapper('/records', {
        method: 'POST',
        body: JSON.stringify(recordData),
      }).catch(error => {
        console.error('Error creating record:', error);
        throw error;
      });
    },
  },
};

// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { api } from 'lib/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Authorization failed: Missing credentials');
          return null;
        }
        
        try {
          const user = await api.auth.login({
            email: credentials.email,
            password: credentials.password,
          });
          return user;
        } catch (error) {
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
