// components/LikeButton.jsx
'use client';
import { useState, useEffect } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [likeCooldown, setLikeCooldown] = useState(false);

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

  return (
    <button
      onClick={handleLike}
      disabled={likeCooldown}
      className={`text-2xl px-4 py-2 rounded-lg border-2 border-red-400 bg-red-100 transition ${
        likeCooldown
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-red-200 cursor-pointer'
      }`}
    >
      ❤️ {likes} Likes
    </button>
  );
}
