"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useToast } from "@/components/ui/use-toast";
import { BarChart2, Pencil, Trash2 } from 'lucide-react';
import { getWeekCompletion } from "@/lib/getWeekCompletion";
import { useSession } from "next-auth/react";
import Link from "next/link";
const PRESET_COLORS = [
  "#66BB6A", // Soft Green (replacing #22c55e)
  "#42A5F5", // Soft Blue (replacing #3b82f6)
  "#FFAB91", // Soft Coral (replacing #f97316, orange)
  "#AB47BC", // Soft Purple (replacing #8b5cf6)
  "#EF5350", // Soft Red (replacing #ef4444)
  "#26C6DA", // Soft Cyan (replacing #06b6d4)
  "#FFCA28", // Soft Amber (replacing #f59e0b)
];
export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({
    habitName: "",
    emoji: "✨",
    color: "#22c55e",
    goal: { frequency: 7 }
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [week, setWeek] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);
  useEffect(() => {
    // Define async function inside useEffect
    const fetchWeekData = async () => {
      try {
        const weekData = await getWeekCompletion();
        setWeek(weekData);
      } catch (error) {
        console.error('Failed to fetch week data:', error);
        setWeek(getEmptyWeek()); // Fallback to empty week on error
      }
    };

    fetchWeekData(); // Call the async function
  }, [habits]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get("/api/habits");
      setHabits(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch habits",
        variant: "destructive",
        className: "bg-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async () => {
    if (!newHabit.habitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
        className: "bg-red-600",
      });
      return;
    }

    // Check if non-pro user has reached limit
    if (!session?.user?.isPro && habits.length >= 3) {
      toast({
        title: "Upgrade Required",
        description: "Free users can only create up to 3 habits. Upgrade to Pro for unlimited habits!",
        variant: "default",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/pricing')}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Upgrade to Pro
          </Button>
        ),
      });
      return;
    }

    try {
      await axios.post("/api/habits", newHabit);
      toast({
        title: "Success",
        description: "Habit created successfully",
        className: "border-gray-300",
      });
      setIsAddOpen(false);
      fetchHabits();
      setNewHabit({
        habitName: "",
        emoji: "✨",
        color: "#22c55e",
        goal: { frequency: 7 }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create habit",
        variant: "destructive",
        className: "bg-red-600",
      });
    }
  };

  const updateHabit = async (habitId, updates) => {
    try {
      const { _id, ...updateData } = updates;

      if(updates.goal.frequency>7 || updates.goal.frequency<1 ){
        toast({
          title: "Error",
          description: "Goal is between 1-7",
          variant: "destructive",
          className: "bg-red-600",
        });
        return;
      }

      const response = await axios.put(`/api/habits/${habitId}`, updateData);
      await fetchHabits(); 
      setEditingHabit(null);
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Habit updated successfully",
        className: "border-gray-300",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update habit",
        variant: "destructive",
        className: "bg-red-600",
      });
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`/api/habits/${habitId}`);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
            className: "border-gray-300",
      });
      fetchHabits();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
        className: "bg-red-600",
      });
    }
  };

  const toggleDay = async (habitId, date) => {
    const habit = habits.find(h => h._id === habitId);
    if (!habit) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        toast({
          title: "Error",
          description: "You cannot select a future date.",
          variant: "destructive",
          className: "bg-red-600",
        });
        return;
      }
      const updatedLogs = [...(habit.logs || [])];
      const existingLog = updatedLogs.findIndex(log => log.date === date);

      if (existingLog !== -1) {
        updatedLogs[existingLog].status = !updatedLogs[existingLog].status;
      } else {
        updatedLogs.push({ date, status: true });
      }

      const response = await axios.put(`/api/habits/${habitId}`, {
        ...habit,
        logs: updatedLogs
      });

      setHabits(habits.map(h => h._id === habitId ? response.data : h));
      toast({
        title: "Success",
        description: "Progress updated",
            className: "border-gray-300",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
        className: "bg-red-600",
      });
    }
  };

  const getWeekDays = (logs = []) => {
    const today = new Date();
    const days = [];
  
    // Get Sunday of the current week
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    startOfWeek.setDate(today.getDate() - dayOfWeek);
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
  
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
        }).toUpperCase(),
        dayNum: date.getDate(),
        checked: logs.some(log => log.date === dateStr && log.status),
      });
    }
  
    return days;
  };
  

  const getTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit =>
      habit.logs.some(log => log.date === today && log.status)
    ).length;

    return {
      percentage: totalHabits ? Math.round((completedHabits / totalHabits) * 100) : 0,
      completed: completedHabits,
      total: totalHabits
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Habits</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  if (!session?.user?.isPro && habits.length >= 3) {
                    toast({
                      title: "Upgrade Required",
                      description: "Free users can only create up to 3 habits. Upgrade to Pro for unlimited habits!",
                      variant: "default",
                      action: (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push('/pricing')}
                          className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Upgrade to Pro
                        </Button>
                      ),
                    });
                    return;
                  }
                  setIsAddOpen(true);
                }}
              >
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] ">
              <DialogHeader>
                <DialogTitle className="">Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-sm mb-2 block">Name</label>
                    <Input
                      value={newHabit.habitName}
                      onChange={(e) => setNewHabit({ ...newHabit, habitName: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter habit name"
                    />
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">Weekly Goal</label>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      value={newHabit.goal?.frequency || 7}
                      onChange={(e) => setNewHabit({
                        ...newHabit,
                        goal: { frequency: parseInt(e.target.value) || 1 }
                      })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block">Choose an Emoji</label>
                  <EmojiPicker
                    theme={Theme.DARK}
                    lazyLoadEmojis
                    height={350}
                    width="100%"
                    onEmojiClick={(emoji) => setNewHabit({ ...newHabit, emoji: emoji.emoji })}
                    autoFocusSearch
                  />
                </div>

                <div>
                  <label className="text-sm mb-2 block">Color</label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <Button
                        key={color}
                        className={`w-8 h-8 rounded-full ${newHabit.color === color ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={createHabit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-secondary rounded-lg p-4 flex items-center justify-center ">
          <div className="grid grid-cols-7 gap-6">
            {week.map((day) => (
              <div
                key={day.date}
                className={`flex flex-col items-center py-2  w-20  rounded-2xl ${day.date === todayDateStr ? 'bg-green-100/50 border border-green-400' : ''
                  }`}
              >
                <span className="text-sm mb-1 text-foreground">{day.day}</span>
                <div className="relative flex items-center justify-center w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={PRESET_COLORS[0]} // Orange for progress
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${day.completionRate}, 100`}
                    />
                    <text
                      x="18"
                      y="20.35"
                      className="text-[10px] font-bold fill-foreground"
                      textAnchor="middle"
                    >
                      {day.dayNum}
                    </text>
                  </svg>
                  {day.date === todayDateStr && (
                    <div className="absolute -bottom-4 w-3 h-3 bg-green-400 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>



        <div className="flex items-center gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>

            <DialogContent className="max-w-[300px]">
              <DialogHeader>
                <DialogTitle className="">Edit Habit</DialogTitle>
              </DialogHeader>
              {editingHabit && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm mb-2 block">Name</label>
                      <Input
                        value={editingHabit.habitName}
                        onChange={(e) => setEditingHabit(prev => prev ? ({
                          ...prev,
                          habitName: e.target.value
                        }) : null)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Goal</label>
                      <Input
                        type="number"
                        min={1}
                        max={7}
                        value={editingHabit.goal.frequency}
                        onChange={(e) => setEditingHabit(prev => prev ? ({
                          ...prev,
                          goal: {
                            frequency: parseInt(e.target.value) || 1
                          }
                        }) : null)}
                        className="bg-gray-800 border-gray-700 text-white w-20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">Emoji</label>
                    <EmojiPicker
                      theme={Theme.DARK}
                      lazyLoadEmojis
                      height={350}
                      width="100%"
                      onEmojiClick={(emoji) => setEditingHabit(prev => prev ? ({
                        ...prev,
                        emoji: emoji.emoji
                      }) : null)}
                      autoFocusSearch
                    />
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">Color</label>
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${editingHabit.color === color ? 'ring-2 ' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditingHabit(prev => prev ? ({
                            ...prev,
                            color
                          }) : null)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => updateHabit(editingHabit._id, editingHabit)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>

      </div>
      <div className="space-y-6">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="rounded-2xl p-6 bg-secondary"
          >
            <div className="flex items-center justify-between mb-6 ">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => router.push(`/habits/${habit._id}`)}
              >
                <div className="text-2xl w-8 h-8 flex items-center justify-center rounded-2xl ">
                  {habit.emoji || "✨"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold  ">
                    {habit.habitName}
                  </h2>
                  <p className="text-gray-600">
                    {habit?.goal?.frequency || 0} times a week
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                
                <Button
                  variant="ghost"
                  size="icon"
                  className=""
                  onClick={() => {
                    setEditingHabit(habit);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 "
                  onClick={() => deleteHabit(habit._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {getWeekDays(habit.logs).map((day) => (
                <button
                  key={day.date}
                  onClick={() => toggleDay(habit._id, day.date)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${day.checked
                    ? 'text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  style={{
                    backgroundColor: day.checked ? habit.color : undefined
                  }}
                >
                  <span className="text-xs mb-1">{day.day}</span>
                  <span className="text-lg font-bold">{day.dayNum}</span>
                  
                </button>
              ))}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No habits yet. Create one to get started!
          </div>
        )}
      </div>

    </div>
  );
}
