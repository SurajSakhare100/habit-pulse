'use client'

import { useEffect, useState } from 'react'
import {
  format,
  eachDayOfInterval,
  isSameDay,
  getMonth,
  subMonths,
  startOfWeek,
} from 'date-fns'
import { Card } from './ui/card'
import { Habit } from '@/types'
import { cn } from '@/lib/utils'

interface YearMapProps {
  className?: string
  habit: Habit
}

export function YearMap({ className, habit }: YearMapProps) {
  const [yearData, setYearData] = useState<(Date | null)[]>([])

  useEffect(() => {
    const today = new Date()
    const startOfPast8Months = subMonths(today, 8)
    const paddedStart = startOfWeek(startOfPast8Months, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: paddedStart, end: today })
    setYearData(days)
  }, [habit.logs]) // Re-run when logs change

  const hasHabitLogForDate = (date: Date) =>
    habit.logs?.some(log => isSameDay(new Date(log.date), date) && log.status)

  const getColorForDate = (date: Date) => {
    if (hasHabitLogForDate(date)) return 'bg-primary' // Logged
    return 'bg-muted' // No log
  }

  // Build week grid
  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = []

  yearData.forEach((date, index) => {
    currentWeek.push(date)
    if ((index + 1) % 7 === 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  // Month label generation
  const monthLabels: { label: string; index: number }[] = []
  let lastMonth = -1

  weeks.forEach((week, weekIndex) => {
    const firstDate = week.find(d => d !== null)
    if (firstDate) {
      const month = getMonth(firstDate)
      if (month !== lastMonth) {
        monthLabels.push({ label: format(firstDate, 'MMM'), index: weekIndex })
        lastMonth = month
      }
    }
  })

  return (
    <Card className={cn('p-4', 'overflow-x-auto flex items-center justify-center', className)}>
      <div className="flex items-center justify-center mb-2">
        <h3 className="text-lg text-center font-medium">Habit Entries (Past 8 Months)</h3>
      </div>

      {/* Month labels */}
      <div className="flex ml-6 mb-1 gap-1 items-center justify-center">
        {weeks.map((_, weekIndex) => {
          const month = monthLabels.find(m => m.index === weekIndex)
          return (
            <div key={weekIndex} className="w-3 text-xs text-muted-foreground text-center">
              {month ? month.label : ''}
            </div>
          )
        })}
      </div>

      <div className="flex gap-1 items-center justify-center">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 mr-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground w-3 h-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                if (date && date > new Date()) return null

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'aspect-square rounded-sm w-3 h-3',
                      date ? getColorForDate(date) : 'bg-muted/10',
                      'hover:opacity-80 transition-opacity'
                    )}
                    title={
                      date
                        ? hasHabitLogForDate(date)
                          ? `Entry: ${format(date, 'MMM d, yyyy')}`
                          : `No entry: ${format(date, 'MMM d, yyyy')}`
                        : ''
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
