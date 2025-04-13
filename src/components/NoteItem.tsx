'use client'

import { format } from "date-fns"
import { Button } from "./ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface NoteItemProps {
  id: string
  title: string
  content: string
  date: Date
  time?: string
  onDelete?: (id: string) => void
  onUpdate?: (id: string, title: string, content: string) => void
}

export function NoteItem({ 
  id, 
  title, 
  content, 
  date, 
  time, 
  onDelete, 
  onUpdate 
}: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedContent, setEditedContent] = useState(content)

  const handleUpdate = async () => {
    if (!editedTitle || !editedContent) return

    try {
      if (onUpdate) { 
        await onUpdate(id, editedTitle, editedContent)
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Journal entry updated successfully"
        })
      }
    } catch (error) {
      console.error('Failed to update journal entry:', error)
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive"
      })
    }
  }



  const handleDelete = async () => {
    try {
      if (onDelete) {
      await onDelete(id)
      toast({
        title: "Success",
        description: "Journal entry deleted successfully"
      })}
    } catch (error) {
      console.error('Failed to delete journal entry:', error)
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex gap-2  bg-card items-start justify-center rounded-2xl p-4 ">
      {/* Date Column */}
      <div className="p-4 m-1 aspect-square flex flex-col bg-secondary items-center justify-center rounded-xl shadow-sm">
        <div className="font-medium text-xs text-muted-foreground">
          {format(date, 'EEE').toUpperCase()}
        </div>
        <div className="text-2xl font-bold text-primary">
          {format(date, 'd')}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 border-0 ">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Enter title"
                    className="w-full"
                  />
           
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                  <h2 className="font-medium text-lg">{title}</h2>
                  
                  </div>
                  <p className="text-sm text-wrap leading-relaxed text-foreground/90">
                    {content}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </Button>
              ) : (
                <>
                {
                  time && (
                    <Badge variant="secondary" className="text-xs">
                    {time}
                  </Badge>
                  )
                }
                  {onUpdate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                </>
              )}
            </div>
          </div>
         
        </div>
      </div>
    </div>
  )
}