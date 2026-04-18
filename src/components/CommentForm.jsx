'use client';

import { useState } from 'react';

export default function CommentForm({ onCommentAdded }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);

    // This calls your Cloudinary upload logic in api/upload/route.js
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;

    setLoading(true);
    try {
      // Step 1: Upload files to get Cloudinary URLs
      const avatarUrl = await uploadFile(avatarFile);
      const imageUrl = await uploadFile(imageFile);

      // Step 2: Save the final comment data
      // UPDATED: Using singular /api/comment to match your folder structure
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          author,
          avatar: avatarUrl,
          image: imageUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Success! New Comment Data:', data.newComment); // 🔥 Check this in your browser console
        onCommentAdded(data.newComment);
        // Reset form
        setText('');
        setAuthor('');
        setAvatarFile(null);
        setImageFile(null);

        // Reset file inputs manually if needed
        e.target.reset();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to post comment'}`);
      }
    } catch (err) {
      console.error('Submission failed', err);
      alert('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
    >
      <input
        className="w-full p-2 border rounded outline-blue-500"
        placeholder="Your Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border rounded outline-blue-500"
        placeholder="Write a birthday wish..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows="3"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Your Profile Photo:
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Attach a Birthday Photo:
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Uploading & Posting...' : 'Post Birthday Wish 🎂'}
      </button>
    </form>
  );
}

// 'use client';

// import { useState } from 'react';

// export default function CommentForm({ onCommentAdded }) {
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     try {
//       setLoading(true);
//       const res = await fetch('/api/comment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         onCommentAdded(data.newComment);
//         setText('');
//         setSuccess('Comment posted successfully!');
//         setTimeout(() => setSuccess(null), 3000); // clear after 3 seconds
//       } else {
//         setError(data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       setError('Failed to submit comment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <textarea
//         className="w-full border rounded p-2 mb-2"
//         rows="3"
//         placeholder="Write a comment..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         {loading ? (
//           <>
//             Posting...
//             <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//           </>
//         ) : (
//           'Post Comment'
//         )}
//       </button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {success && <p className="text-green-600 mt-2">{success}</p>}
//     </form>
//   );
// }
