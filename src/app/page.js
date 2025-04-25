'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeCooldown, setLikeCooldown] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch('/api/likes');
        const data = await res.json();
        setLikes(data.likes);
      } catch (err) {
        console.error('Failed to load likes:', err);
      }
    };

    fetchLikes();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment');
        const data = await res.json();
        setComments(data.comments || []);
        setCommentsLoaded(true);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };

    if (showComments && !commentsLoaded) {
      fetchComments();
    }
  }, [showComments, commentsLoaded]);

  const handleLike = async () => {
    if (likeCooldown) {
      alert('Please wait before liking again.');
      return;
    }

    try {
      const res = await fetch('/api/likes', { method: 'POST' });
      const data = await res.json();
      setLikes(data.likes);
      setLikeCooldown(true);
      setTimeout(() => setLikeCooldown(false), 3000);
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data.newComment]);
        setCommentInput('');
        setShowComments(true);
        if (!commentsLoaded) setCommentsLoaded(true);
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 font-sans max-w-4xl mx-auto">
      {/* 🎈 Birthday Dedication Banner */}
      <div className="bg-pink-100 border-2 border-pink-300 p-4 rounded-xl text-center mb-8">
        <h1 className="text-3xl text-pink-600 font-bold">
          🎉 Happy 5th Birthday, Ruth! 🎂
        </h1>
        <p className="text-gray-700 mt-2">
          This website is lovingly dedicated to you — our little sunshine 🌞
        </p>
        <p className="text-sm text-gray-500">27 April 2025</p>
      </div>

      {/* 🎈 Image Gallery */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📸 Memories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Image
            src="/images/img1.jpg"
            alt="Birthday Image 1"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/img2.jpg"
            alt="Birthday Image 2"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/img3.jpg"
            alt="Birthday Image 3"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/img4.jpg"
            alt="Birthday Image 4"
            width={300}
            height={200}
            className="rounded-lg"
          />
        </div>
      </section>

      <h1 className="text-2xl font-bold mb-2">🎉 You're Invited!</h1>
      <p className="mb-4">Click to like this invitation:</p>

      <button
        onClick={handleLike}
        disabled={likeCooldown}
        className={`text-2xl px-4 py-2 rounded-lg border-2 border-red-400 bg-red-100 transition 
          ${
            likeCooldown
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-200 cursor-pointer'
          }`}
      >
        ❤️ {likes} Likes
      </button>

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">💬 Comments</h2>

      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="mb-4 bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200"
      >
        {showComments ? 'Hide Comments' : 'View Comments'}
      </button>

      <form
        onSubmit={handleComment}
        className="flex flex-wrap items-center mb-4"
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onFocus={() => setShowComments(true)}
          disabled={loading}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-72 mb-2 sm:mb-0 sm:mr-2"
        />
        <button
          type="submit"
          disabled={loading || !commentInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Post'}
        </button>
      </form>

      {showComments && (
        <div>
          {comments.length === 0 ? (
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {comments.map((comment) => (
                <li key={comment._id} className="text-gray-800">
                  🗨️ {comment.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
