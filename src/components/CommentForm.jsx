'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CommentForm({ onCommentAdded }) {
  const { data: session } = useSession();
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file) => {
    if (!file || !(file instanceof File)) return '';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error('Image upload failed:', err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert('Please write a message');

    setLoading(true);
    try {
      // 🚀 Step 1: Upload images first
      const [avatarUrl, imageUrl] = await Promise.all([
        uploadFile(avatarFile),
        uploadFile(imageFile),
      ]);

      // 🚀 Step 2: Build the payload
      const payload = {
        text,
        author: session?.user?.name || author || 'Anonymous',
        // ✅ CRITICAL: Ensures isOwner works in CommentsList.jsx
        authorEmail: session?.user?.email || 'guest@birthday.com',
        avatar: avatarUrl || session?.user?.image || '',
        image: imageUrl || '',
      };

      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      const data = await res.json();
      onCommentAdded(data.newComment);

      // 🚀 Step 3: Reset Form
      setText('');
      setAuthor('');
      setAvatarFile(null);
      setImageFile(null);
      e.target.reset();
      alert('Wish posted successfully! 🎂');
    } catch (err) {
      console.error('Submission failed:', err);
      alert(
        err.message ||
          'The server is a bit busy. Please try again with a smaller photo!',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border rounded-xl bg-white shadow-md"
    >
      {!session && (
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none text-gray-800"
          placeholder="Your Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      )}
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none text-gray-800"
        placeholder="Write a birthday wish for Ruth..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows="3"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-600 mb-1">Your Photo:</span>
          <input
            type="file"
            accept="image/*"
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-600 mb-1">
            Attach Best Wishes:
          </span>
          <input
            type="file"
            accept="image/*"
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending Wish...
          </span>
        ) : (
          'Post Birthday Wish 🎂'
        )}
      </button>
    </form>
  );
}
