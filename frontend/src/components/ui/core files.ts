// src/app/layout.tsx
import { Providers } from 'components/Providers';
import { Header } from 'components/shared/Header';
import { Sidebar } from 'components/shared/Sidebar';
import 'styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-4">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid credentials' : 'An error occurred');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn('google')}
      >
        Continue with Google
      </Button>
    </form>
  );
}

// src/components/appointments/AppointmentCard.tsx
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';

interface AppointmentCardProps {
  id: string;
  doctorName: string;
  datetime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

export const AppointmentCard = ({
  id,
  doctorName,
  datetime,
  status,
  onCancel,
  onReschedule,
}: AppointmentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment with Dr. {doctorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Date: {format(datetime, 'MMMM d, yyyy')}</p>
          <p>Time: {format(datetime, 'h:mm a')}</p>
          <p className="capitalize">Status: {status}</p>
          <div className="flex space-x-2">
            {status !== 'cancelled' && (
              <Button
                variant="destructive"
                onClick={() => onCancel(id)}
              >
                Cancel
              </Button>
            )}
            {status !== 'cancelled' && (
              <Button
                variant="outline"
                onClick={() => onReschedule(id)}
              >
                Reschedule
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchWrapper('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      fetchWrapper('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },
  appointments: {
    getAll: () => fetchWrapper('/appointments'),
    create: (appointmentData: any) =>
      fetchWrapper('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      }),
    update: (appointmentData: any) =>
      fetchWrapper('/appointments', {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      }),
  },
};
