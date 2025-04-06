'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DailyNoteProps {
  habitId: string;
}

interface Note {
  _id: string;
  habitId: string;
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
            notes.map((note) => (
              <li key={note._id} className="border rounded-lg p-4 ">
                <p className="text-sm  mb-1">
                  {dayjs(note.date).format('MMMM D, YYYY')} {note.date === today && '(Today)'}
                </p>
                {editingId === note._id ? (
                  <>
                    <Textarea
                      placeholder="Edit your note..."
                      className="w-full border rounded mb-2"
                      value={note.content}
                      onChange={(e) =>
                        setNotes(prev =>
                          prev.map(n =>
                            n._id === note._id ? { ...n, content: e.target.value } : n
                          )
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(note)} className="bg-green-600 text-white flex items-center gap-1">
                        <Save size={16} /> Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} className="bg-gray-400 text-white flex items-center gap-1">
                        <X size={16} /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className=" whitespace-pre-line mb-2">{note.content}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => setEditingId(note._id)} className="bg-yellow-500 text-white flex items-center gap-1">
                        <Edit size={16} /> Edit
                      </Button>
                      <Button onClick={() => handleDelete(note._id)} className="bg-red-600 text-white flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
