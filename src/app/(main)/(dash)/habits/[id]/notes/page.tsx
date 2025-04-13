'use client'

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotesList } from "@/components/NotesList"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Note } from "@/types"

interface Habit {
  _id: string
  habitName: string
  emoji: string
}

export default function NotesPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState<Note[]>([])
  const [habit, setHabit] = useState<Habit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    fetchHabit()
    fetchNotes()
  }, [])

  const fetchHabit = async () => {
    try {
      const response = await axios.get(`/api/habits/${params.id}`)
      setHabit(response.data)
    } catch (error) {
      console.error('Failed to fetch habit:', error)
      toast({
        title: "Error",
        description: "Failed to fetch habit information",
        variant: "destructive"
      })
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`/api/notes?habitId=${params.id}`)
      setNotes(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content || !selectedDate) return

    // Prevent future date entries
    const now = new Date()
    if (selectedDate > now) {
      toast({
        title: "Error",
        description: "Cannot add journal entries for future dates",
        variant: "destructive"
      })
      return
    }

    // Check for existing note on the same day
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingNote = notes.find(note => {
      const noteDate = new Date(note.date)
      return noteDate >= startOfDay && noteDate <= endOfDay
    })

    if (existingNote) {
      toast({
        title: "Error",
        description: "You can only create one journal entry per day",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post('/api/notes', {
        title,
        content,
        habitId: params.id,
        date: selectedDate
      })
      setTitle("")
      setContent("")
      setSelectedDate(new Date())
      toast({
        title: "Success",
        description: "Journal entry created successfully"
      })
      fetchNotes()
    } catch (error: any) {
      console.error('Failed to create journal entry:', error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create journal entry",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`)
      toast({
        title: "Success",
        description: "Note deleted successfully"
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to delete note:', error)
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      })
    }
  }

  const handleUpdate = async (id: string, title: string, content: string) => {
    try {
      await axios.put(`/api/notes/${id}`, {
        title,
        content
      })
      toast({
        title: "Success",
        description: "Note updated successfully"
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to update note:', error)
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header with habit info and back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/habits/${params.id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {habit && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{habit.emoji}</span>
              <h1 className="text-2xl font-semibold">{habit.habitName}</h1>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[400px,1fr]">
        {/* Create Note Form */}
        <Card className="p-6 h-fit">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Add a Note</h2>
              <p className="text-sm text-muted-foreground">
                Write down your thoughts or progress
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date
                </label>
                <DatePicker
                  date={selectedDate}
                  setDate={setSelectedDate}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                   Title (Short, descriptive)
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your note"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Journal Entry
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your journal entry..."
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                Create Note
              </Button>
            </form>
          </div>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Notes</h2>
            <span className="text-sm text-muted-foreground">
              {notes.length} items
            </span>
          </div>
          
            <NotesList 
              notes={notes}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
        </div>
      </div>
    </div>
  )
} 