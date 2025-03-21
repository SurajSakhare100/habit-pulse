"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IHabit } from "@/models/Habit";
import { LineChart } from "@/components/line-chart";
import { format, startOfWeek, eachDayOfInterval, addDays, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PRESET_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ef4444", "#06b6d4", "#f59e0b"];

export default function HabitPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [habit, setHabit] = useState<IHabit | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingHabit, setEditingHabit] = useState<IHabit | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchHabit();
    }
  }, [params.id, status]);

  const fetchHabit = async () => {
    try {
      const response = await axios.get(`/api/habits/${params.id}`);
      setHabit(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch habit",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyProgress = () => {
    if (!habit) return { days: [], percentage: 0 };

    const startDate = startOfWeek(new Date());
    const weekDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6)
    });

    const days = weekDays.map((date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return {
        date: dateStr,
        day: format(date, 'EEE'),
        completed: habit.logs.some(log => log.date === dateStr && log.status)
      };
    });

    const completedDays = days.filter((d: { completed: boolean }) => d.completed).length;
    const percentage = Math.round((completedDays / habit.goal.frequency) * 100);

    return { days, percentage };
  };

  const getMonthlyProgress = () => {
    if (!habit) return { completed: 0, total: 0, percentage: 0 };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = habit.logs.filter(log => {
      const logDate = new Date(log.date);
      return isSameMonth(logDate, currentDate) && log.status;
    });

    return {
      completed: monthDays.length,
      total: habit.goal.frequency * 4,
      percentage: Math.round((monthDays.length / (habit.goal.frequency * 4)) * 100)
    };
  };

  const toggleDay = async (date: string) => {
    if (!habit) return;
    
    try {
      const updatedLogs = [...(habit.logs || [])];
      const existingLog = updatedLogs.findIndex(log => log.date === date);
      
      if (existingLog !== -1) {
        updatedLogs[existingLog].status = !updatedLogs[existingLog].status;
      } else {
        updatedLogs.push({ date, status: true });
      }

      const response = await axios.put(`/api/habits/${params.id}`, {
        ...habit,
        logs: updatedLogs
      });

      setHabit(response.data);
      toast({
        title: "Success",
        description: "Progress updated successfully",
        className: "bg-gray-900 text-white border-gray-800",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingHabit) return;

    try {
      const frequency = editingHabit.goal.frequency;
      
      // Client-side validation first
      if (!Number.isInteger(frequency) || frequency < 1 || frequency > 7) {
        toast({
          title: "Invalid Goal",
          description: "Goal must be a whole number between 1 and 7 days per week",
          variant: "destructive",
          className: "bg-red-900 text-white border-red-800",
        });
        return;
      }

      const response = await axios.put(`/api/habits/${params.id}`, editingHabit);
      setHabit(response.data);
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Habit updated successfully",
        className: "bg-gray-900 text-white border-gray-800",
      });
    } catch (error: any) {
      // Show validation error from server in toast
      if (error.response?.status === 400) {
        toast({
          title: "Invalid Goal",
          description: error.response.data || "Goal must be a whole number between 1 and 7 days per week",
          variant: "destructive",
          className: "bg-red-900 text-white border-red-800",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update habit",
          variant: "destructive",
          className: "bg-red-900 text-white border-red-800",
        });
      }
    }
  };

  const deleteHabit = async () => {
    if (!habit) return;
    
    try {
      await axios.delete(`/api/habits/${params.id}`);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
        className: "bg-gray-900 text-white border-gray-800",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
      });
    }
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayNum: day,
        checked: habit?.logs.some(log => log.date === dateStr && log.status) || false
      });
    }
    
    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (!habit) return <div>Habit not found</div>;

  const weeklyProgress = getWeeklyProgress();
  const monthlyProgress = getMonthlyProgress();

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-8 w-8 text-2xl" />
          Back
        </Button>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{habit.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{habit.habitName}</h1>
              <p className="text-gray-400">
                Goal: {habit.goal.frequency} times per week
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => {
                    setEditingHabit({
                      ...habit,
                      habitName: habit.habitName || "",
                      emoji: habit.emoji || "✨",
                      color: habit.color || PRESET_COLORS[0],
                      goal: {
                        frequency: habit.goal?.frequency || 7
                      }
                    });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[300px]">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Habit</DialogTitle>
                </DialogHeader>
                {editingHabit && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-sm text-gray-400 mb-2 block">Name</label>
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
                        <label className="text-sm text-gray-400 mb-2 block">Goal</label>
                        <Input
                          type="number"
                          min={1}
                          max={7}
                          value={editingHabit.goal.frequency}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setEditingHabit(prev => prev ? ({
                              ...prev,
                              goal: {
                                frequency: value || 1
                              }
                            }) : null);
                          }}
                          className="bg-gray-800 border-gray-700 text-white w-20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Emoji</label>
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
                      <label className="text-sm text-gray-400 mb-2 block">Color</label>
                      <div className="flex gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full ${editingHabit.color === color ? 'ring-2 ring-white' : ''}`}
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
                      onClick={handleSaveEdit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/50"
              onClick={deleteHabit}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Weekly Progress */}
          <Card className="bg-gray-900 p-6 rounded-2xl h-60">
            <h2 className="text-xl font-semibold text-white mb-4">This Week</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                {weeklyProgress.days.filter(d => d.completed).length} of {habit.goal.frequency} days completed
              </div>
              <div className="text-2xl font-bold" style={{ color: habit.color }}>
                {weeklyProgress.percentage}%
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => toggleDay(day.date)}
                  className="flex flex-col items-center p-2 rounded-lg transition-all"
                  style={{ 
                    backgroundColor: day.completed ? habit.color : 'rgb(17, 24, 39)',
                    color: day.completed ? 'white' : 'rgb(156, 163, 175)'
                  }}
                >
                  <span className="text-xs">{day.day}</span>
                  <span className="text-sm mt-1">
                    {new Date(day.date).getDate()}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Monthly Progress */}
          {/* <Card className="bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">This Month</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400">
                {monthlyProgress.completed} of {monthlyProgress.total} days completed
              </div>
              <div className="text-2xl font-bold" style={{ color: habit.color }}>
                {monthlyProgress.percentage}%
              </div>
            </div>
            <div className="relative w-full h-24">
              <LineChart
                data={habit.logs.map(log => ({
                  date: log.date,
                  completion: log.status ? 1 : 0
                }))}
                color={habit.color}
              />
            </div>
          </Card> */}
           {/* Calendar */}
        <Card className="bg-gray-900 p-4 rounded-2xl">
          <div className="flex items-center text-white justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)}><ArrowLeft className="mr-2 h-8 w-8 text-2xl" /></Button>
            <h2 className="text-lg font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => changeMonth(1)}><ArrowRight className="mr-2 h-8 w-8 text-2xl" /></Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm text-gray-400 py-1">
                {day[0]}
              </div>
            ))}
            
            {getMonthDays().map((day: { date: string; dayNum: number; checked: boolean } | null, index) => (
              <div 
                key={index} 
                className={`aspect-square p-0.5 ${!day ? 'pointer-events-none' : ''}`}
              >
                {day && (
                  <button
                    onClick={() => toggleDay(day.date)}
                    className={`w-full h-full rounded-full flex items-center justify-center text-lg transition-all ${
                      day.checked
                        ? 'text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                    style={{ 
                      backgroundColor: day.checked ? habit.color : undefined 
                    }}
                  >
                    {day.dayNum}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
        </div>

       
      </div>
    </div>
  );
}
