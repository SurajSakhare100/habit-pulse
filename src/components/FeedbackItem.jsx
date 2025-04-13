import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ChevronUp, Pencil, Trash2, Save, X } from 'lucide-react';
import { useSession } from "next-auth/react"; // Import useSession hook to get logged-in user info

export default function FeedbackItem({ feedback, onUpvote, onEdit, onDelete }) {
  const { data: session } = useSession(); // Get the current session data
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(feedback.title);
  const [editedDescription, setEditedDescription] = useState(feedback.description);

  const handleEdit = () => {
    onEdit(feedback._id, { 
      title: editedTitle.trim(),
      description: editedDescription.trim()
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(feedback.title);
    setEditedDescription(feedback.description);
  };

  const isOwner = feedback.userId === session?.user.id; 

  return (
    <div className="p-4 mb-4 bg-white dark:bg-[#161616] rounded-2xl shadow-xl ">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <>
              <Input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Title"
                autoFocus
                className="w-full"
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Description"
                className="w-full min-h-[80px]"
              />
            </>
          ) : (
            <>
              <h3 className="font-medium text-lg">{feedback.title}</h3>
              <p className="">{feedback.description}</p>
            </>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="flex flex-col items-center border rounded-2xl p-2">
            <button
              onClick={() => onUpvote(feedback._id)}
              disabled={isEditing}
              className="flex flex-col items-center p-2 rounded-lg  transition-colors"
            >
              <ChevronUp className="w-4 h-4 " />
              <span className="text-sm font-medium">{feedback.upvotes}</span>
            </button>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mt-4 flex gap-2 justify-end">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-green-600 hover:text-green-800"
                disabled={!editedTitle.trim() || !editedDescription.trim()}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(feedback._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
