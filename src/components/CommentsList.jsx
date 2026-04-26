'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';

export default function CommentsList() {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleLike = async (id) => {
    if (!session?.user?.email) {
      alert('Please sign in to like wishes!');
      return;
    }
    try {
      const res = await axios.post(`/api/comment/${id}/like`, {
        email: session.user.email,
      });
      setComments((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (error) {
      console.error('Like toggle failed', error);
    }
  };

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
      console.error('Edit upload failed:', err);
      return '';
    }
  };

  const handleDelete = async (id) => {
    if (deletingId === id) return;
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

  const handleUpdate = async (id, currentImageUrl) => {
    if (!editText.trim()) return;
    setUpdating(true);
    try {
      let finalImageUrl = currentImageUrl;
      if (editFile) {
        const uploadedUrl = await uploadFile(editFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }
      const res = await axios.patch(`/api/comment/${id}`, {
        text: editText,
        image: finalImageUrl,
      });
      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, text: res.data.text, image: res.data.image }
            : c,
        ),
      );
      setEditingId(null);
      setEditFile(null);
    } catch (error) {
      alert('Failed to update wish');
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
    setCurrentPage(1);
  };

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt),
  );

  const currentComments = sortedComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage,
  );
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        Gathering birthday wishes...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
      <CommentForm onCommentAdded={handleCommentAdded} />

      <div className="flex justify-between items-center border-b pb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-pink-600 font-bold"
        >
          {showComments ? 'Hide Wishes' : `View Wishes (${comments.length})`}
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="text-pink-700 font-bold"
        >
          Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {showComments && (
        <ul className="space-y-6">
          {currentComments.map((comment) => {
            const isOwner =
              session?.user?.email &&
              session?.user?.email === comment.authorEmail;
            const hasLiked = comment.likes?.includes(session?.user?.email);

            return (
              <li
                key={comment._id}
                className="p-6 bg-white border rounded-2xl shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={comment.avatar || 'https://via.placeholder.com/50'}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full border-2 border-pink-100 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-900">
                      {comment.author || 'Guest'}
                    </p>

                    {editingId === comment._id ? (
                      <div className="mt-2 space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border rounded-lg text-gray-800"
                          rows="2"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-500">
                            Update Photo:
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="text-xs text-gray-500"
                            onChange={(e) => setEditFile(e.target.files[0])}
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdate(comment._id, comment.image)
                            }
                            className="bg-pink-600 text-white px-4 py-1 rounded-md font-bold text-sm"
                            disabled={updating}
                          >
                            {updating ? 'Updating...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditFile(null);
                            }}
                            className="bg-gray-200 px-4 py-1 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 mt-1">{comment.text}</p>
                        {comment.image && (
                          <img
                            src={comment.image}
                            alt="Wish attachment"
                            className="mt-4 rounded-xl max-h-[400px] w-full object-contain border"
                          />
                        )}
                        <button
                          onClick={() => handleLike(comment._id)}
                          className="flex items-center gap-1 mt-3 transition-all hover:scale-110 active:scale-90"
                        >
                          <span
                            className={`text-xl ${hasLiked ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            {hasLiked ? '❤️' : '🤍'}
                          </span>
                          <span className="text-xs font-bold text-gray-600">
                            {comment.likes?.length || 0}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {isOwner && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.text);
                        }}
                        className="text-blue-500 text-xs font-bold bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      {/* FIXED DELETE LOGIC START */}
                      {confirmDeleteId !== comment._id ? (
                        <button
                          onClick={() => setConfirmDeleteId(comment._id)}
                          className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                        >
                          Delete
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1 bg-red-50 p-2 rounded-lg border border-red-100">
                          <span className="text-[10px] font-black text-red-600 uppercase">
                            Sure?
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(comment._id)}
                              disabled={deletingId === comment._id}
                              className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                            >
                              {deletingId === comment._id ? '...' : 'YES'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-[10px] font-bold"
                            >
                              NO
                            </button>
                          </div>
                        </div>
                      )}
                      {/* FIXED DELETE LOGIC END */}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-white border rounded-lg font-bold shadow-sm disabled:opacity-30"
          >
            Prev
          </button>
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 flex items-center justify-center bg-pink-600 text-white rounded-xl font-black">
              {currentPage}
            </span>
            <span className="text-gray-400 font-bold">of {totalPages}</span>
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-white border rounded-lg font-bold shadow-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import CommentForm from './CommentForm';

// export default function CommentsList() {
//   const { data: session } = useSession();
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showComments, setShowComments] = useState(true);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [commentsPerPage] = useState(5);
//   const [deletingId, setDeletingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [editFile, setEditFile] = useState(null); // State for new image during edit
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       const res = await axios.get('/api/comment');
//       setComments(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to upload files during editing
//   const uploadFile = async (file) => {
//     if (!file || !(file instanceof File)) return '';
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const res = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       if (!res.ok) throw new Error('Upload failed');
//       const data = await res.json();
//       return data.url;
//     } catch (err) {
//       console.error('Edit upload failed:', err);
//       return '';
//     }
//   };

//   const handleDelete = async (id) => {
//     if (deletingId === id) return;
//     try {
//       setDeletingId(id);
//       await axios.delete(`/api/comment/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//       setConfirmDeleteId(null);
//     } catch (error) {
//       alert('Failed to delete');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleUpdate = async (id, currentImageUrl) => {
//     if (!editText.trim()) return;
//     setUpdating(true);
//     try {
//       let finalImageUrl = currentImageUrl;

//       // If a new file was picked during editing, upload it first
//       if (editFile) {
//         const uploadedUrl = await uploadFile(editFile);
//         if (uploadedUrl) finalImageUrl = uploadedUrl;
//       }

//       const res = await axios.patch(`/api/comment/${id}`, {
//         text: editText,
//         image: finalImageUrl,
//       });

//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === id
//             ? { ...c, text: res.data.text, image: res.data.image }
//             : c,
//         ),
//       );
//       setEditingId(null);
//       setEditFile(null);
//     } catch (error) {
//       alert('Failed to update wish');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ✅ Fixed: Added back the missing function that caused the ReferenceError
//   const handleCommentAdded = (newComment) => {
//     setComments((prev) => [newComment, ...prev]);
//     setCurrentPage(1);
//   };

//   const sortedComments = [...comments].sort((a, b) =>
//     sortOrder === 'desc'
//       ? new Date(b.createdAt) - new Date(a.createdAt)
//       : new Date(a.createdAt) - new Date(b.createdAt),
//   );

//   const currentComments = sortedComments.slice(
//     (currentPage - 1) * commentsPerPage,
//     currentPage * commentsPerPage,
//   );
//   const totalPages = Math.ceil(comments.length / commentsPerPage);

//   if (loading)
//     return (
//       <p className="text-center py-10 text-gray-500 animate-pulse">
//         Gathering birthday wishes...
//       </p>
//     );

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
//       <CommentForm onCommentAdded={handleCommentAdded} />

//       <div className="flex justify-between items-center border-b pb-4">
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="text-pink-600 font-bold"
//         >
//           {showComments ? 'Hide Wishes' : `View Wishes (${comments.length})`}
//         </button>
//         <button
//           onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//           className="text-pink-700 font-bold"
//         >
//           Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
//         </button>
//       </div>

//       {showComments && (
//         <ul className="space-y-6">
//           {currentComments.map((comment) => {
//             const isOwner =
//               session?.user?.email &&
//               session?.user?.email === comment.authorEmail;

//             return (
//               <li
//                 key={comment._id}
//                 className="p-6 bg-white border rounded-2xl shadow-md"
//               >
//                 <div className="flex items-start gap-4">
//                   <img
//                     src={comment.avatar || 'https://via.placeholder.com/50'}
//                     alt="User avatar"
//                     className="w-12 h-12 rounded-full border-2 border-pink-100 object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-extrabold text-gray-900">
//                       {comment.author || 'Guest'}
//                     </p>
//                     {editingId === comment._id ? (
//                       <div className="mt-2 space-y-3">
//                         <textarea
//                           value={editText}
//                           onChange={(e) => setEditText(e.target.value)}
//                           className="w-full p-2 border rounded-lg text-gray-800"
//                           rows="2"
//                         />

//                         <div className="flex flex-col gap-1">
//                           <span className="text-xs font-bold text-gray-500">
//                             Update Photo:
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
//                             onChange={(e) => setEditFile(e.target.files[0])}
//                           />
//                         </div>

//                         <div className="mt-2 flex gap-2">
//                           <button
//                             onClick={() =>
//                               handleUpdate(comment._id, comment.image)
//                             }
//                             className="bg-pink-600 text-white px-4 py-1 rounded-md font-bold text-sm"
//                             disabled={updating}
//                           >
//                             {updating ? 'Updating...' : 'Save Changes'}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingId(null);
//                               setEditFile(null);
//                             }}
//                             className="bg-gray-200 px-4 py-1 rounded-md text-sm"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <p className="text-gray-700 mt-1">{comment.text}</p>
//                         {comment.image && (
//                           <img
//                             src={comment.image}
//                             alt="Wish attachment"
//                             className="mt-4 rounded-xl max-h-[400px] w-full object-contain border"
//                           />
//                         )}
//                       </>
//                     )}
//                   </div>
//                   {isOwner && (
//                     <div className="flex flex-col gap-2">
//                       <button
//                         onClick={() => {
//                           setEditingId(comment._id);
//                           setEditText(comment.text);
//                         }}
//                         className="text-blue-500 text-xs font-bold bg-blue-50 px-2 py-1 rounded"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => setConfirmDeleteId(comment._id)}
//                         className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 {confirmDeleteId === comment._id && (
//                   <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
//                     <span className="text-red-700 text-xs font-bold">
//                       Really delete this wish?
//                     </span>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleDelete(comment._id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded text-xs"
//                       >
//                         Yes
//                       </button>
//                       <button
//                         onClick={() => setConfirmDeleteId(null)}
//                         className="text-gray-500 text-xs"
//                       >
//                         No
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       {/* --- PAGINATION CONTROLS --- */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 py-10">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-4 py-2 bg-white border rounded-lg font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all"
//           >
//             Prev
//           </button>

//           <div className="flex items-center gap-2">
//             <span className="w-10 h-10 flex items-center justify-center bg-pink-600 text-white rounded-xl font-black">
//               {currentPage}
//             </span>
//             <span className="text-gray-400 font-bold">of {totalPages}</span>
//           </div>

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-4 py-2 bg-white border rounded-lg font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
