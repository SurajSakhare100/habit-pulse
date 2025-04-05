import FeedbackItem from './FeedbackItem';

export default function FeedbackList({ feedbacks, onUpvote, onEdit, onDelete }) {

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
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
