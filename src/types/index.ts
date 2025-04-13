export interface Note {
  _id: string
  title: string
  content: string
  date: string
  time?: string
  habitId?: string
  updatedAt?: string
} 
export interface Log {
  _id: string
  date: string
  completed: boolean
  status: boolean
}
export interface Habit {
  _id: string
  habitName: string
  color: string
  emoji: string
  logs: Log[]
  goal:{
    frequency: number
  }
}

