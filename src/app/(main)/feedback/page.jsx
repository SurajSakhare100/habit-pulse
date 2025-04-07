"use client";

import { useEffect, useState } from "react";
import { fetchFeedback, upvoteFeedback, editFeedback, deleteFeedback } from "@/lib/api";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleFeedbackSubmit = (newFeedback) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const handleUpvote = async (feedbackId) => {
    try {
      const updatedFeedback = await upvoteFeedback(feedbackId);
      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === feedbackId ? updatedFeedback : fb))
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = async (feedbackId, updatedData) => {
    try {
      const updatedFeedback = await editFeedback(feedbackId, updatedData);
      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === feedbackId ? updatedFeedback : fb))
      );
      const freshFeedbacks = await fetchFeedback();
      setFeedbacks(freshFeedbacks);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== feedbackId));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedback();
        setFeedbacks(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Share Your Feedback</h1>

      <FeedbackForm onFeedbackSubmit={handleFeedbackSubmit} />

      <Separator className="mb-4" />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <FeedbackList
          feedbacks={feedbacks}
          onUpvote={handleUpvote}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
