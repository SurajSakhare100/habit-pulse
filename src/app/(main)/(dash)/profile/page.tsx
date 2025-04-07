"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfileData {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
  };
  stats: {
    totalHabits: number;
    habits: {
      _id: string;
      habitName: string;
      emoji: string;
      color: string;
      completedLogs: number;
      totalLogs: number;
      completionRate: number;
    }[];
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-6">
          {profileData.user.image && (
            <Image
              src={profileData.user.image}
              alt={profileData.user.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">{profileData.user.name}</h1>
            <p className="text-gray-500">{profileData.user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Member since {new Date(profileData.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Habit Statistics</h2>
        <p className="mb-4">Total Habits: {profileData.stats.totalHabits}</p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habit</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Completed/Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profileData.stats.habits.map((habit) => (
              <TableRow key={habit._id}>
                <TableCell className="font-medium">
                  <span className="mr-2">{habit.emoji}</span>
                  {habit.habitName}
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${habit.completionRate}%`,
                        backgroundColor: habit.color,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {habit.completionRate}%
                  </span>
                </TableCell>
                <TableCell>
                  {habit.completedLogs}/{habit.totalLogs}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
