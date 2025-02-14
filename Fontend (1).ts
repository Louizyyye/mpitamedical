'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar } from 'components/ui/calendar'; // Corrected quotes
import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card'; // Corrected quotes
import { Button } from 'components/ui/button'; // Corrected quotes
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs'; // Corrected quotes

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <Button className="mt-4 w-full">Book Appointment</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Appointment list will be populated here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Medical records will be populated here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Health Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Reminders will be populated here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const response = await fetch(`${process.env.API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
