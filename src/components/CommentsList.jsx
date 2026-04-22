'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // ✅ NEW: Access user session
import CommentForm from './CommentForm';

export default function CommentsList() {
  const { data: session } = useSession(); // ✅ Get logged-in user info
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5);

  // States for Deleting/Editing
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
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

  const handleDelete = async (id) => {
    if (deletingId === id) return;
    try {
      setDeletingId(id);
      await axios.delete(`/api/comment/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Unauthorized: You can only delete your own wishes.');
      } else if (error.response?.status === 404) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert('Failed to delete');
      }
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
    setCurrentPage(1);
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
      <p className="text-center py-10 font-medium text-gray-500 animate-pulse">
        Gathering birthday wishes...
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
            className="text-pink-600 font-bold hover:text-pink-800 transition-colors text-sm md:text-base"
          >
            {showComments ? 'Hide Wishes' : `View Wishes (${comments.length})`}
          </button>

          <select
            value={commentsPerPage}
            onChange={(e) => {
              setCommentsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs md:text-sm border border-gray-300 rounded-lg p-1 bg-white outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="bg-gradient-to-r from-pink-50 to-pink-100 px-4 md:px-5 py-2 rounded-xl font-bold text-pink-700 shadow-sm hover:shadow-md transition-all active:scale-95 text-xs md:text-sm border border-pink-200"
        >
          Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {showComments && (
        <>
          <ul className="space-y-6">
            {currentComments.map((comment) => {
              // 🔒 SECURITY CHECK: Does this comment belong to the current user?
              const isOwner = session?.user?.email === comment.authorEmail;

              return (
                <li
                  key={comment._id}
                  className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 flex-1 w-full">
                    <img
                      src={
                        comment.avatar ||
                        'https://via.placeholder.com/50?text=User'
                      }
                      alt="User Avatar"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-pink-100 shadow-sm object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      {editingId === comment._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 bg-gray-50 outline-none transition-all shadow-inner text-sm md:text-base"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(comment._id)}
                              className="bg-pink-600 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm hover:bg-pink-700 transition-colors text-sm"
                            >
                              {updating ? '...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-extrabold text-gray-900 text-sm md:text-base italic truncate max-w-[150px]">
                              {comment.author || 'Guest'}
                            </p>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <small className="text-gray-400 font-medium text-[10px] md:text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </small>
                          </div>

                          <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed font-medium break-words">
                            {comment.text}
                          </p>
                          {comment.image && (
                            <div className="mt-2 mb-4 w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                              <img
                                src={comment.image}
                                alt="Birthday wish photo"
                                className="w-full h-auto max-h-[400px] object-contain hover:scale-[1.01] transition-transform duration-500"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* 🔒 PROTECTED ACTIONS: Only shown if isOwner is true */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {isOwner && editingId !== comment._id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditText(comment.text);
                          }}
                          className="text-blue-500 hover:text-blue-700 font-bold text-xs md:text-sm bg-blue-50 px-4 py-2 md:px-3 md:py-1 rounded-lg transition-colors"
                        >
                          Edit
                        </button>

                        {confirmDeleteId === comment._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="bg-red-500 text-white px-4 py-2 md:px-3 md:py-1 rounded-lg font-bold text-[10px] md:text-xs shadow-sm"
                            >
                              Confirm?
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-gray-400 text-[10px] md:text-xs font-bold px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(comment._id)}
                            disabled={deletingId === comment._id}
                            className="text-red-400 hover:text-red-600 font-bold text-xs md:text-sm bg-red-50 px-4 py-2 md:px-3 md:py-1 rounded-lg transition-colors"
                          >
                            {deletingId === comment._id ? '...' : 'Delete'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-10">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-full md:w-auto p-2 px-8 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all text-sm"
              >
                Prev
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Page
                </span>
                <span className="w-10 h-10 flex items-center justify-center bg-pink-600 text-white rounded-xl font-black shadow-pink-200 shadow-lg">
                  {currentPage}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  of {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-full md:w-auto p-2 px-8 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all text-sm"
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

//   // --- PAGINATION STATES ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [commentsPerPage, setCommentsPerPage] = useState(5);

//   // States for Deleting/Editing
//   const [deletingId, setDeletingId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');
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

//   const handleDelete = async (id) => {
//     if (deletingId === id) return;
//     try {
//       setDeletingId(id);
//       await axios.delete(`/api/comment/${id}`);
//       setComments((prev) => prev.filter((c) => c._id !== id));
//       setConfirmDeleteId(null);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setComments((prev) => prev.filter((c) => c._id !== id));
//         return;
//       }
//       alert('Failed to delete');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleUpdate = async (id) => {
//     if (!editText.trim()) return;
//     setUpdating(true);
//     try {
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
//     setComments((prev) => [newComment, ...prev]);
//     setCurrentPage(1);
//     setTimeout(() => {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, 100);
//   };

//   // --- LOGIC: SORTING & PAGINATION ---
//   const sortedComments = [...comments].sort((a, b) =>
//     sortOrder === 'desc'
//       ? new Date(b.createdAt) - new Date(a.createdAt)
//       : new Date(a.createdAt) - new Date(b.createdAt),
//   );

//   const indexOfLastComment = currentPage * commentsPerPage;
//   const indexOfFirstComment = indexOfLastComment - commentsPerPage;
//   const currentComments = sortedComments.slice(
//     indexOfFirstComment,
//     indexOfLastComment,
//   );
//   const totalPages = Math.ceil(comments.length / commentsPerPage);

//   if (loading)
//     return (
//       <p className="text-center py-10 font-medium text-gray-500">
//         Loading wishes...
//       </p>
//     );

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
//       <CommentForm onCommentAdded={handleCommentAdded} />

//       {/* Control Bar */}
//       <div className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-4 gap-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setShowComments(!showComments)}
//             className="text-blue-600 font-bold hover:text-blue-800 transition-colors text-sm md:text-base"
//           >
//             {showComments
//               ? 'Hide Comments'
//               : `View Comments (${comments.length})`}
//           </button>

//           <select
//             value={commentsPerPage}
//             onChange={(e) => {
//               setCommentsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="text-xs md:text-sm border border-gray-300 rounded-lg p-1 bg-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//           >
//             <option value={5}>Show 5</option>
//             <option value={10}>Show 10</option>
//             <option value={20}>Show 20</option>
//           </select>
//         </div>

//         <button
//           onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//           className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 md:px-5 py-2 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95 text-xs md:text-sm"
//         >
//           Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
//         </button>
//       </div>

//       {showComments && (
//         <>
//           <ul className="space-y-6">
//             {currentComments.map((comment) => (
//               <li
//                 key={comment._id}
//                 className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 shadow-md hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex items-start gap-4 flex-1 w-full">
//                   <img
//                     src={
//                       comment.avatar ||
//                       'https://via.placeholder.com/50?text=User'
//                     }
//                     alt="User Avatar"
//                     className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 border-white shadow-sm object-cover flex-shrink-0 ring-2 ring-blue-50"
//                   />

//                   <div className="flex-1 min-w-0">
//                     {editingId === comment._id ? (
//                       <div className="space-y-3">
//                         <textarea
//                           value={editText}
//                           onChange={(e) => setEditText(e.target.value)}
//                           className="w-full p-3 border-2 border-transparent rounded-xl focus:border-blue-400 bg-gray-50 outline-none transition-all shadow-inner text-sm md:text-base"
//                           rows="2"
//                         />
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleUpdate(comment._id)}
//                             className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors text-sm"
//                           >
//                             {updating ? '...' : 'Save'}
//                           </button>
//                           <button
//                             onClick={() => setEditingId(null)}
//                             className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex items-center gap-2 mb-1 flex-wrap">
//                           <p className="font-extrabold text-gray-900 text-sm md:text-base italic truncate max-w-[150px] md:max-w-none">
//                             {comment.author || 'Anonymous'}
//                           </p>
//                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                           <small className="text-gray-400 font-medium text-[10px] md:text-xs">
//                             {new Date(comment.createdAt).toLocaleDateString()}
//                           </small>
//                         </div>

//                         <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed font-medium break-words">
//                           {comment.text}
//                         </p>
//                         {comment.image && (
//                           <div className="mt-2 mb-4 w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
//                             <img
//                               src={comment.image}
//                               alt="Birthday wish photo"
//                               className="w-full h-auto max-h-[400px] object-contain hover:scale-[1.01] transition-transform duration-500"
//                             />
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Updated Actions: Responsive behavior */}
//                 <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
//                   {editingId !== comment._id && (
//                     <>
//                       <button
//                         onClick={() => {
//                           setEditingId(comment._id);
//                           setEditText(comment.text);
//                         }}
//                         className="text-blue-500 hover:text-blue-700 font-bold text-xs md:text-sm bg-blue-50 px-4 py-2 md:px-3 md:py-1 rounded-lg transition-colors"
//                       >
//                         Edit
//                       </button>

//                       {confirmDeleteId === comment._id ? (
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleDelete(comment._id)}
//                             className="bg-red-500 text-white px-4 py-2 md:px-3 md:py-1 rounded-lg font-bold text-[10px] md:text-xs shadow-sm"
//                           >
//                             Confirm?
//                           </button>
//                           <button
//                             onClick={() => setConfirmDeleteId(null)}
//                             className="text-gray-400 text-[10px] md:text-xs font-bold px-2"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => setConfirmDeleteId(comment._id)}
//                           disabled={deletingId === comment._id}
//                           className="text-red-400 hover:text-red-600 font-bold text-xs md:text-sm bg-red-50 px-4 py-2 md:px-3 md:py-1 rounded-lg transition-colors"
//                         >
//                           {deletingId === comment._id ? '...' : 'Delete'}
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-10">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => {
//                   setCurrentPage((p) => p - 1);
//                   window.scrollTo({ top: 400, behavior: 'smooth' });
//                 }}
//                 className="w-full md:w-auto p-2 px-8 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all text-sm"
//               >
//                 Prev
//               </button>

//               <div className="flex items-center gap-2">
//                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                   Page
//                 </span>
//                 <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-black shadow-blue-200 shadow-lg">
//                   {currentPage}
//                 </span>
//                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                   of {totalPages}
//                 </span>
//               </div>

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => {
//                   setCurrentPage((p) => p + 1);
//                   window.scrollTo({ top: 400, behavior: 'smooth' });
//                 }}
//                 className="w-full md:w-auto p-2 px-8 bg-white border border-gray-200 rounded-xl font-bold shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all text-sm"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
