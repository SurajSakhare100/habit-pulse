'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { NoteItem } from './NoteItem';
import { NotesList } from './NotesList';

interface DailyNoteProps {
  habitId: string;
}

interface Note {
  _id: string;
  habitId: string;
  title: string;
  date: string;
  content: string;
  updatedAt: string;
  }

export default function DailyNotes({ habitId }: DailyNoteProps) {
  const { toast } = useToast();
  const today = dayjs().format('YYYY-MM-DD');
  const [date, setDate] = useState(today);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    try {
      const res = await axios.get<Note[]>('/api/notes/daily', { params: { habitId } });
      const sortedNotes = res.data.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
      setNotes(sortedNotes);

      const todayEntry = sortedNotes.find(n => n.date === date);
      if (todayEntry) {
        setContent(todayEntry.content);
      } else {
        setContent('');
      }
    } catch (err) {
      console.error('Error loading notes', err);
      toast({
        title: 'Error',
        description: 'Failed to load notes.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadNotes();
  }, [habitId]);

  const handleSave = async () => {
    try {
      await axios.post('/api/notes/daily', { content }, {
        params: { habitId, date },
      });
      setContent('');
      setDate(today);
      toast({ title: 'Note saved', description: 'Your note has been added.' });
      loadNotes();
    } catch (err) {
      console.error('Error saving note', err);
      toast({
        title: 'Error',
        description:
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : 'Failed to save the note.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const note = notes.find(n => n._id === noteId);
      if (!note) return;

      await axios.delete('/api/notes/daily', {
        params: { habitId: note.habitId, date: note.date },
      });

      toast({ title: 'Note deleted', description: 'The note was removed.' });
      loadNotes();
    } catch (err) {
      console.error('Error deleting note', err);
      toast({
        title: 'Error',
        description: 'Failed to delete the note.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (note: Note) => {
    try {
      await axios.put('/api/notes/daily', {
        updatedContent: note.content,
      }, {
        params: { habitId: note.habitId, date: note.date },
      });

      setEditingId(null);
      toast({ title: 'Note updated', description: 'Changes saved.' });
      loadNotes();
    } catch (err) {
      console.error('Error updating note', err);
      toast({
        title: 'Error',
        description: 'Could not update the note.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {/* Left Panel */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Write New Note</h2>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-3"
          
        />
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          rows={6}
          className="mb-3"
        />
        <Button onClick={handleSave} className="bg-blue-600 text-white">
          Save
        </Button>
      </div>

      {/* Right Panel */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Notes</h2>
        <ul className="space-y-4 overflow-y-scroll h-80 pr-2">
          {notes.length === 0 ? (
            <p className="">No notes found.</p>
          ) : (

            <NotesList notes={notes} onUpdate={(id, title, content) => handleUpdate({ _id: id, title, content, date, habitId, updatedAt: "" })} onDelete={handleDelete} />
          )}
        </ul>
      </div>
    </div>
  );
}
