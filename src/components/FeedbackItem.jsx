import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Heart, Pencil, Trash2, Save, X } from 'lucide-react';

export default function FeedbackItem({ feedback, onUpvote, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(feedback.content);

  const handleEdit = () => {
    onEdit(feedback._id, { content: editedContent.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(feedback.content);
  };

  return (
    <div className="relative p-4 mb-4 border rounded-lg shadow-sm bg-white">
      {/* Row: Content + Upvote button aligned right center */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          {isEditing ? (
            <Input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              autoFocus
              className="w-full"
            />
          ) : (
            <p className="text-gray-800">{feedback.content}</p>
          )}
        </div>

        {/* Upvote button aligned right center */}
        <div className="flex-shrink-0 h-full self-center items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpvote(feedback._id)}
            className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
            disabled={isEditing}
          >
            <Heart className="w-4 h-4" /> {feedback.upvotes}
          </Button>
        </div>
      </div>

      {/* Row: Edit/Delete/Save/Cancel Buttons below content */}
      <div className="mt-2 flex gap-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="text-green-600 hover:text-green-800"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(feedback._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
