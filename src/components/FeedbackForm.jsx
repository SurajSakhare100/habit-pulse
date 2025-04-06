import { useState } from 'react';
import { submitFeedback } from '@/lib/api';
import { Textarea } from './ui/textarea'; // Replace with your actual textarea component
import { Button } from './ui/button';

export default function FeedbackForm({ onFeedbackSubmit }) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFeedback = await submitFeedback({ content: feedback.trim() });
      onFeedbackSubmit(newFeedback);
      setFeedback('');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm ">
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback..."
        required
        className="min-h-[80px]"
      />
      <Button  type="submit" disabled={!feedback.trim()}>
        Submit
      </Button>
    </form>
  );
}
