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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Feedback Form */}
        <div className="col-span-2 md:col-span-1 ">
          <Card className=" shadow-sm ">
            <CardContent className="">
              <h1 className="text-2xl font-bold mb-6">Suggest a feature</h1>
              <FeedbackForm onFeedbackSubmit={handleFeedbackSubmit} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Feedback List */}
        <div className="col-span-2 md:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Feedback</h2>
                <span className="text-sm text-muted-foreground">
                  {feedbacks.length} items
                </span>
              </div>
              <FeedbackList
                feedbacks={feedbacks}
                onUpvote={handleUpvote}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
