'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

export default function CommentsList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  // States for Deleting
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Custom Confirm State

  // States for Editing
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [updating, setUpdating] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment');
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/comment/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    setUpdating(true);
    try {
      const res = await axios.patch(`/api/comment/${id}`, { text: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, text: res.data.text } : c))
      );
      setEditingId(null);
    } catch (error) {
      alert('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
      100
    );
  };

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <CommentForm onCommentAdded={handleCommentAdded} />

      <div className="flex justify-between items-center border-b pb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-600 font-bold hover:underline"
        >
          {showComments
            ? 'Hide Comments'
            : `View Comments (${comments.length})`}
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="bg-gray-200 px-4 py-2 rounded-md font-semibold"
        >
          Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {showComments && (
        <ul className="space-y-4">
          {sortedComments.map((comment) => (
            <li
              key={comment._id}
              className="p-5 bg-white border border-gray-300 rounded-lg flex items-center justify-between gap-6 shadow-sm"
            >
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={`https://i.pravatar.cc/50?u=${comment._id}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border shadow-sm"
                />

                <div className="flex-1">
                  {editingId === comment._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border-2 border-blue-400 rounded-md outline-none"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          className="bg-green-600 text-white px-4 py-1 rounded font-bold"
                        >
                          {updating ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-4 py-1 rounded font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 text-lg mb-1">
                        {comment.text}
                      </p>
                      <small className="text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS ON THE RIGHT */}
              <div className="flex items-center gap-6 min-w-35 justify-end">
                {editingId !== comment._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditText(comment.text);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-bold text-lg"
                    >
                      Edit
                    </button>

                    {confirmDeleteId === comment._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm"
                        >
                          Sure?
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-gray-500 font-bold text-sm"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(comment._id)}
                        disabled={deletingId === comment._id}
                        className="text-red-600 hover:text-red-800 font-bold text-lg"
                      >
                        {deletingId === comment._id ? '...' : 'Delete'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
          <div ref={bottomRef} />
        </ul>
      )}
    </div>
  );
}
