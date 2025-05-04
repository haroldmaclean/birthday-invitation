'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

export default function CommentsList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [deletingId, setDeletingId] = useState(null); // New
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment');
      const fetchedComments = res.data;
      setComments(Array.isArray(fetchedComments) ? fetchedComments : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentsVisibility = () => {
    setShowComments((prev) => !prev);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`/api/comment/${id}`);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  if (loading) return <p>Loading comments...</p>;

  return (
    <div>
      <CommentForm onCommentAdded={handleCommentAdded} />

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleCommentsVisibility}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>

        <button
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-gray-200 text-black rounded"
        >
          Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {showComments && (
        <ul>
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <li
                key={comment._id}
                className="mb-4 p-4 border border-gray-300 rounded flex items-start gap-4 justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={`https://i.pravatar.cc/40?u=${comment._id}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p>{comment.text}</p>
                    <small className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(comment._id)}
                  disabled={deletingId === comment._id}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  {deletingId === comment._id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
          <div ref={bottomRef} />
        </ul>
      )}
    </div>
  );
}
