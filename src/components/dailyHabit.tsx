'use client';

import { useState, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { Habit } from '@/types';
import Link from 'next/link';
import { Card } from './ui/card';

export default function DailyHabit({
  habit,
  today,
  toggleDay
}:{habit:Habit, today:string, toggleDay:()=>void}) {
  const [isChecked, setIsChecked] = useState(habit.logs.find(log => log.date === today)?.status);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(!!checked);

    // Play the tick sound when the checkbox is checked
    if (checked) {

      // Trigger confetti from the top-right of the card
      if (cardRef.current) {
        const { top, left, width } = cardRef.current.getBoundingClientRect();
        const confettiOrigin = { x: left + width, y: top };

        confetti({
          particleCount: 100,
          spread: 70,
          angle: 45,
          origin: {
            x: confettiOrigin.x / window.innerWidth,
            y: confettiOrigin.y / window.innerHeight,
          },
        });
      }
    }
  };

  return (
    <div
      ref={cardRef}
      key={habit._id}
      className="group p-4 w-full my-3   dark:bg-black bg-white mx-auto rounded-2xl shadow-md flex justify-between items-center relative"
    >
      <div className='w-full flex justify-between items-center'>
        
      <div className="text-left flex items-center gap-2">
        <Link href={`/habits/${habit._id}`} className='aspect-square flex items-center justify-center gap-2 bg-muted rounded-xl p-1 mr-2'>
          <p className='text-4xl'>
          {habit.emoji}
          </p>
          
        </Link>
       <div>
       <p className={cn(
            'text-lg font-semibold transition-colors',
            isChecked && 'line-through text-muted-foreground'
          )}> {habit.habitName}</p>
        <p
          className='text-sm text-muted-foreground'
        >

           {habit.goal.frequency} times a week
        </p>
       </div>
      </div>

      <div className="relative">
        <Checkbox
          aria-label="Mark habit as done"
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          onClick={()=>toggleDay()}
          className={cn(
            'w-8 h-8 border rounded-md flex items-center justify-center',
            'transition-all hover:scale-105 hover:border-primary/70',
            'data-[state=checked]:bg-primary data-[state=checked]:text-white'
          )}
        >
          <Check
            className={cn(
              'w-5 h-5 absolute pointer-events-none transition-opacity duration-200',
              isChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 text-primary'
            )}
          />
        </Checkbox>
      </div>
      </div>
    </div>
  );
}

