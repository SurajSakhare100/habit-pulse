import FeedbackItem from './FeedbackItem';
import { useSession } from "next-auth/react";
import { useToast } from './ui/use-toast';

export default function FeedbackList({ feedbacks, onUpvote, onEdit, onDelete }) {
  const { data: session } = useSession(); // Get the current session data
  const { toast } = useToast();
  const checkOwnership = (feedback) => {
    if (feedback.userId !== session?.user.id) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to edit or delete this feedback.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  if (feedbacks.length === 0) {
    return <p className="text-center text-gray-500">No feedback yet. Be the first to submit!</p>;
  }

  return (
    <div className="feedback-list space-y-4">
      {feedbacks.map((feedback) => (
        <FeedbackItem
          key={feedback._id}
          feedback={feedback}
          onUpvote={onUpvote}
          onEdit={(updatedData) => {
            if (checkOwnership(feedback)) {
              onEdit(feedback._id, updatedData);
            }
          }}
          onDelete={() => {
            if (checkOwnership(feedback)) {
              onDelete(feedback._id);
            }
          }}
        />
      ))}
    </div>
  );
}
