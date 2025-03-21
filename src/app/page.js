"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f97316", // orange
  "#8b5cf6", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f59e0b", // amber
];

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
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
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get("/api/habits");
      setHabits(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch habits",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
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
        className: "bg-red-900 text-white border-red-800",
      });
      return;
    }

    try {
      await axios.post("/api/habits", newHabit);
      toast({
        title: "Success",
        description: "Habit created successfully",
        className: "bg-gray-900 text-white border-gray-800",
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
        className: "bg-red-900 text-white border-red-800",
      });
    }
  };

  const updateHabit = async (habitId, updates) => {
    try {
      // Remove _id from updates to avoid immutable field error
      const { _id, ...updateData } = updates;
      
      const response = await axios.put(`/api/habits/${habitId}`, updateData);
      await fetchHabits(); // Refresh all habits
      setEditingHabit(null);
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Habit updated successfully",
        className: "bg-gray-900 text-white border-gray-800",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update habit",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
      });
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`/api/habits/${habitId}`);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
        className: "bg-gray-900 text-white border-gray-800",
      });
      fetchHabits();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
        className: "bg-red-900 text-white border-red-800",
      });
    }
  };

  const toggleDay = async (habitId, date) => {
    const habit = habits.find(h => h._id === habitId);
    if (!habit) return;

    try {
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

  const getWeekDays = (logs = []) => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: date.getDate(),
        checked: logs.some(log => log.date === dateStr && log.status)
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

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Habits</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddOpen(true)}>Add Habit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] ">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
              <div className="flex gap-2">
              <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">Name</label>
                  <Input
                    value={newHabit.habitName}
                    onChange={(e) => setNewHabit({ ...newHabit, habitName: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter habit name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Weekly Goal</label>
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
                  <label className="text-sm text-gray-400 mb-2 block">Choose an Emoji</label>
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
                  <label className="text-sm text-gray-400 mb-2 block">Color</label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
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

        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Today's Progress</h2>
              <p className="text-gray-400 text-md">
                {getTodayProgress().completed} of {getTodayProgress().total} habits completed
              </p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={PRESET_COLORS[0]}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${getTodayProgress().percentage}, 100`}
                />
                <text
                  x="18"
                  y="20.35"
                  className="text-[8px] font-bold"
                  textAnchor="middle"
                  fill="white"
                >
                  {getTodayProgress().percentage}%
                </text>
              </svg>
            </div>
          </div>
        </div>
        
<div className="flex items-center gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              
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
                      onClick={()=>updateHabit(editingHabit._id,editingHabit)}
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
            className="bg-gray-900 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => router.push(`/habits/${habit._id}`)}
              >
                <div className="text-2xl w-8 h-8 flex items-center justify-center">
                  {habit.emoji || "✨"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {habit.habitName}
                  </h2>
                  <p className="text-gray-400">
                    {habit?.goal?.frequency || 0} times a week
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
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
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/50"
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
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    day.checked
                      ? 'text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
