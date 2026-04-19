'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

export default function CommentsList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5); // Default display limit

  // States for Deleting/Editing
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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
    // 🛑 Prevent duplicate calls
    if (deletingId === id) return;

    try {
      setDeletingId(id);

      console.log('Deleting comment with ID:', id);

      await axios.delete(`/api/comment/${id}`);

      setComments((prev) => prev.filter((c) => c._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('Already deleted');
        return;
      }
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     setDeletingId(id);
  //     await axios.delete(`/api/comment/${id}`);
  //     setComments((prev) => prev.filter((c) => c._id !== id));
  //     setConfirmDeleteId(null);
  //   } catch (error) {
  //     alert('Failed to delete');
  //   } finally {
  //     setDeletingId(null);
  //   }
  // };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    setUpdating(true);
    try {
      const res = await axios.patch(`/api/comment/${id}`, { text: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, text: res.data.text } : c)),
      );
      setEditingId(null);
    } catch (error) {
      alert('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
    setCurrentPage(1); // Reset to page 1 to see the new comment
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // --- LOGIC: SORTING & PAGINATION ---
  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt),
  );

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(
    indexOfFirstComment,
    indexOfLastComment,
  );
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  if (loading)
    return (
      <p className="text-center py-10 font-medium text-gray-500">
        Loading wishes...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
      <CommentForm onCommentAdded={handleCommentAdded} />

      {/* Control Bar */}
      <div className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
          >
            {showComments
              ? 'Hide Comments'
              : `View Comments (${comments.length})`}
          </button>

          {/* Feed Limit Selector */}
          <select
            value={commentsPerPage}
            onChange={(e) => {
              setCommentsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded-lg p-1 bg-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-2 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {showComments && (
        <>
          <ul className="space-y-6">
            {currentComments.map((comment) => (
              <li
                key={comment._id}
                className="p-6 bg-white border border-gray-100 rounded-2xl flex items-start justify-between gap-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      comment.avatar ||
                      'https://via.placeholder.com/50?text=User'
                    }
                    alt="User Avatar"
                    className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm object-cover flex-shrink-0 ring-2 ring-blue-50"
                  />

                  <div className="flex-1">
                    {editingId === comment._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 border-2 border-transparent rounded-xl focus:border-blue-400 bg-gray-50 outline-none transition-all shadow-inner"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(comment._id)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            {updating ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-extrabold text-gray-900 text-base italic">
                            {comment.author || 'Anonymous'}
                          </p>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <small className="text-gray-400 font-medium">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        <p className="text-gray-700 text-lg mb-4 leading-relaxed font-medium">
                          {comment.text}
                        </p>
                        {comment.image && (
                          <div className="mt-2 mb-4 max-w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img
                              src={comment.image}
                              alt="Birthday wish photo"
                              className="w-full h-auto max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* {comment.image && (
                          <div className="mt-2 mb-4 max-w-md rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                            <img
                              src={comment.image}
                              alt="Birthday wish photo"
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                            />
                          </div>
                        )} */}
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3 min-w-[80px]">
                  {editingId !== comment._id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.text);
                        }}
                        className="text-blue-500 hover:text-blue-700 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        Edit
                      </button>

                      {confirmDeleteId === comment._id ? (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-sm"
                          >
                            Confirm?
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-gray-400 text-xs text-center font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(comment._id)}
                          disabled={deletingId === comment._id}
                          className="text-red-400 hover:text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg transition-colors"
                        >
                          {deletingId === comment._id ? '...' : 'Delete'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-10">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="p-2 px-6 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Prev
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Page
                </span>
                <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-black shadow-blue-200 shadow-lg">
                  {currentPage}
                </span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  of {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="p-2 px-6 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import CommentForm from './CommentForm';

// export default function CommentsList() {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showComments, setShowComments] = useState(true);
//   const [sortOrder, setSortOrder] = useState('desc');

//   // States for Deleting
//   const [deletingId, setDeletingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

//   // States for Editing
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [updating, setUpdating] = useState(false);

//   const bottomRef = useRef(null);

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const fetchComments = async () => {
//     try {
//       // SINGULAR FIX: Matches your folder app/api/comment/
//       const res = await axios.get('/api/comment');
//       setComments(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       setDeletingId(id);
//       // SINGULAR FIX: Matches your folder app/api/comment/[id]/
//       await axios.delete(`/api/comment/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//       setConfirmDeleteId(null);
//     } catch (error) {
//       alert('Failed to delete');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleUpdate = async (id) => {
//     if (!editText.trim()) return;
//     setUpdating(true);
//     try {
//       // SINGULAR FIX: Matches your folder app/api/comment/[id]/
//       const res = await axios.patch(`/api/comment/${id}`, { text: editText });
//       setComments((prev) =>
//         prev.map((c) => (c._id === id ? { ...c, text: res.data.text } : c)),
//       );
//       setEditingId(null);
//     } catch (error) {
//       alert('Failed to update');
//     } finally {
//       setUpdating(false);
//     }
//   };
//   const handleCommentAdded = (newComment) => {
//     // Ensure we are getting the clean object from the server response
//     setComments((prev) => [newComment, ...prev]); // Put new ones at the top!

//     setTimeout(() => {
//       // Optional: Scroll to top instead of bottom so they see their new post
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, 100);
//   };

//   const sortedComments = [...comments].sort((a, b) =>
//     sortOrder === 'desc'
//       ? new Date(b.createdAt) - new Date(a.createdAt)
//       : new Date(a.createdAt) - new Date(b.createdAt),
//   );

//   if (loading) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <CommentForm onCommentAdded={handleCommentAdded} />

//       <div className="flex justify-between items-center border-b pb-4">
//         <button
//           onClick={() => setShowComments(!showComments)}
//           className="text-blue-600 font-bold hover:underline"
//         >
//           {showComments
//             ? 'Hide Comments'
//             : `View Comments (${comments.length})`}
//         </button>
//         <button
//           onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//           className="bg-gray-200 px-4 py-2 rounded-md font-semibold"
//         >
//           Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
//         </button>
//       </div>

//       {showComments && (
//         <ul className="space-y-4">
//           {sortedComments.map((comment) => (
//             <li
//               key={comment._id}
//               className="p-5 bg-white border border-gray-300 rounded-lg flex items-start justify-between gap-6 shadow-sm"
//             >
//               <div className="flex items-start gap-4 flex-1">
//                 <img
//                   src={
//                     comment.avatar || 'https://via.placeholder.com/50?text=User'
//                   }
//                   alt="User Avatar"
//                   className="w-12 h-12 rounded-full border shadow-sm object-cover flex-shrink-0"
//                 />

//                 <div className="flex-1">
//                   {editingId === comment._id ? (
//                     <div className="space-y-2">
//                       <textarea
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                         className="w-full p-2 border-2 border-blue-400 rounded-md outline-none"
//                         rows="2"
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleUpdate(comment._id)}
//                           className="bg-green-600 text-white px-4 py-1 rounded font-bold"
//                         >
//                           {updating ? '...' : 'Save'}
//                         </button>
//                         <button
//                           onClick={() => setEditingId(null)}
//                           className="bg-gray-400 text-white px-4 py-1 rounded font-bold"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="font-bold text-gray-900 text-sm mb-1">
//                         {comment.author || 'Anonymous'}
//                       </p>

//                       <p className="text-gray-800 text-lg mb-2 whitespace-pre-wrap">
//                         {comment.text}
//                       </p>

//                       {/* DISPLAY Logic: Shows the Cloudinary photo uploaded via /api/upload */}
//                       {comment.image && (
//                         <div className="mt-3 mb-3 max-w-sm rounded-lg overflow-hidden border">
//                           <img
//                             src={comment.image}
//                             alt="Birthday wish photo"
//                             className="w-full h-auto object-contain"
//                           />
//                         </div>
//                       )}

//                       <small className="text-gray-500 block">
//                         {new Date(comment.createdAt).toLocaleString()}
//                       </small>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-6 min-w-35 justify-end">
//                 {editingId !== comment._id && (
//                   <>
//                     <button
//                       onClick={() => {
//                         setEditingId(comment._id);
//                         setEditText(comment.text);
//                       }}
//                       className="text-blue-600 hover:text-blue-800 font-bold text-lg"
//                     >
//                       Edit
//                     </button>

//                     {confirmDeleteId === comment._id ? (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleDelete(comment._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm"
//                         >
//                           Sure?
//                         </button>
//                         <button
//                           onClick={() => setConfirmDeleteId(null)}
//                           className="text-gray-500 font-bold text-sm"
//                         >
//                           No
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setConfirmDeleteId(comment._id)}
//                         disabled={deletingId === comment._id}
//                         className="text-red-600 hover:text-red-800 font-bold text-lg"
//                       >
//                         {deletingId === comment._id ? '...' : 'Delete'}
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>
//             </li>
//           ))}
//           <div ref={bottomRef} />
//         </ul>
//       )}
//     </div>
//   );
// }
