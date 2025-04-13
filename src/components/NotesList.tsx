'use client'

import { Note } from "@/types"
import { NoteItem } from "./NoteItem"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotesListProps {
  notes: Note[]
  onUpdate: (id: string, title: string, content: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function NotesList({ notes, onUpdate, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No journal entries yet. Start writing your first entry!
      </div>
    )
  }

  return (
    <ScrollArea className="">
      <div className="space-y-4 ">
        {notes.map((note) => (
          <NoteItem
            key={note._id}
            id={note._id}
            title={note.title}
            content={note.content}
            date={new Date(note.date)}
            time={note.time}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  )
} 