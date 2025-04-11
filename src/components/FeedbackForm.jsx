import { useState } from 'react';
import { submitFeedback } from '@/lib/api';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function FeedbackForm({ onFeedbackSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFeedback = await submitFeedback({ 
        title: title.trim(),
        description: description.trim()
      });
      onFeedbackSubmit(newFeedback);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium">Short, descriptive title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Login button color to green"
          required
          className="w-full rounded-2xl"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="The login button color should be green to match our brand colors."
          required
          className="min-h-[80px] rounded-2xl"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full  text-white"
        disabled={!title.trim() || !description.trim()}
      >
        Create Post
      </Button>
    </form>
  );
}
