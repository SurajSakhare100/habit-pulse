'use client'

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import axios from "axios"

interface HabitStats {
  id: string
  name: string
  emoji: string
  color: string
  completions: number
  goal: number
  progress: number
  weeklyData: {
    day: string
    value: number
  }[]
}

interface AnalyticsData {
  averageScore: number
  totalCompleted: number
  weeklyData: {
    day: string
    value: number
  }[]
  habits: HabitStats[]
}

export default function HabitsAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/habits/analytics')
        setData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-60 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Completed: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Score Card */}
        <Card className="p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-semibold text-lg mb-2">Weekly Score</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-primary/20"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-primary"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={352}
                    strokeDashoffset={352 - (352 * data.averageScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round(data.averageScore)}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Total Completed
                </div>
                <div className="text-3xl font-bold">
                  {data.totalCompleted}
                </div>
                <div className="text-sm text-muted-foreground">
                  habits this week
                </div>
              </div>
            </div>
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" 
            style={{ maskImage: 'radial-gradient(circle at top left, black, transparent)' }}
          />
        </Card>

        {/* Weekly Progress Card */}
        <Card className="p-6">
          <div className="space-y-1 mb-4">
            <h3 className="font-semibold text-lg">Weekly Progress</h3>
            <p className="text-sm text-muted-foreground">
              Habit completion trend
            </p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Individual Habits Section */}
      <Card className="p-6">
        <div className="space-y-1 mb-6">
          <h3 className="font-semibold text-lg">Habit Details</h3>
          <p className="text-sm text-muted-foreground">
            Individual habit performance
          </p>
        </div>
        <div className="space-y-6">
          {data.habits.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No habits found. Start by creating a new habit!
            </div>
          ) : (
            data.habits.map((habit) => (
              <div key={habit.id} className="grid gap-4 md:grid-cols-[1fr,2fr] items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.emoji}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(habit.progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{ 
                        width: `${Math.min(100, Math.round(habit.progress))}%`,
                        backgroundColor: habit.color 
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {habit.completions} / {habit.goal} completed
                    </span>
                  </div>
                </div>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={habit.weeklyData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                        style={{ fill: habit.color }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
} 