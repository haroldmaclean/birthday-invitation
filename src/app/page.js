'use client';

import PostHeader from '@/components/PostHeader';
import MediaGallery from '@/components/MediaGallery';
import CommentsList from '@/components/CommentsList';
import LikeButton from '@/components/LikeButton';
import Carousel from '@/components/Carousel';
import LoginButton from '@/components/LoginButton';

export default function HomePage() {
  return (
    /* Added overflow-x-hidden to prevent layout breaking on legacy mobile browsers */
    <div className="bg-gradient-to-b from-pink-50 to-gray-100 min-h-screen py-6 md:py-12 px-2 sm:px-4 overflow-x-hidden">
      {/* 🔐 AUTH SECTION */}
      <div className="max-w-2xl mx-auto flex justify-end mb-6">
        <LoginButton />
      </div>

      {/* 🎬 Featured Media Carousel */}
      <div className="max-w-2xl mx-auto mb-6 shadow-2xl rounded-2xl overflow-hidden">
        <Carousel />
      </div>

      {/* The Main Invitation Card - Added w-full and responsive rounded corners */}
      <main className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl md:rounded-3xl overflow-hidden border border-white mt-4">
        {/* 1. Profile/Header */}
        <div className="px-4 sm:px-6 pt-6">
          <PostHeader />
        </div>

        {/* 2. Celebration Text - Adjusted padding for small screens */}
        <div className="px-4 sm:px-8 pb-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            🎉 Happy 6th Birthday, <span className="text-pink-600">Ruth!</span>{' '}
            🎂
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
            🎈 You're Invited! Join us in celebrating{' '}
            <span className="font-bold">six wonderful years</span> of joy,
            laughter, and being{' '}
            <span className="italic font-semibold text-pink-500">fabulous</span>
            .
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-y border-gray-50 py-4">
            <LikeButton />
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 px-4 py-2 rounded-full animate-pulse">
              <span className="text-lg">✨</span>
              <p className="text-[11px] sm:text-sm font-bold text-pink-600 italic">
                Tap the heart to send Ruth some love!
              </p>
            </div>
          </div>
        </div>

        {/* 3. Media Gallery (Video/Photos) */}
        <div className="bg-gray-50">
          <MediaGallery />
        </div>

        {/* 4. Guestbook Section */}
        <div className="px-4 sm:px-6 py-8 bg-white">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Leave a Wish ✍️
            </h2>
            <p className="text-gray-500 text-sm">
              Share a memory or a sweet message for the birthday girl
            </p>
          </div>
          <CommentsList />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12">
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
          Made with ❤️ for Ruth's 6th Birthday
        </p>
        <p className="text-gray-300 text-xs mt-2">© 2026 • Six & Fabulous</p>
      </footer>
    </div>
  );
}

// 'use client';

// import PostHeader from '@/components/PostHeader';
// import MediaGallery from '@/components/MediaGallery';
// import CommentsList from '@/components/CommentsList';
// import LikeButton from '@/components/LikeButton';
// import Carousel from '@/components/Carousel';
// import LoginButton from '@/components/LoginButton';

// export default function HomePage() {
//   return (
//     <div className="bg-gradient-to-b from-pink-50 to-gray-100 min-h-screen py-6 md:py-12 px-4">
//       {/* 🔐 AUTH SECTION */}
//       <div className="max-w-2xl mx-auto flex justify-end mb-6">
//         <LoginButton />
//       </div>

//       {/* 🎬 Featured Media Carousel */}
//       <div className="max-w-2xl mx-auto mb-6 shadow-2xl rounded-2xl overflow-hidden">
//         <Carousel />
//       </div>

//       {/* The Main Invitation Card */}
//       <main className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-white mt-4">
//         {/* 1. Profile/Header */}
//         <div className="px-6 pt-6">
//           <PostHeader />
//         </div>

//         {/* 2. Celebration Text */}
//         <div className="px-8 pb-6 text-center md:text-left">
//           <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
//             🎉 Happy 6th Birthday, <span className="text-pink-600">Ruth!</span>{' '}
//             🎂
//           </h1>

//           <p className="text-xl text-gray-600 leading-relaxed mb-6">
//             🎈 You're Invited! Join us in celebrating six wonderful years of
//             joy, laughter, and being{' '}
//             <span className="italic font-semibold text-pink-500">fabulous</span>
//             .
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-6 border-y border-gray-50 py-4">
//             <LikeButton />
//             <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 px-4 py-2 rounded-full animate-pulse">
//               <span className="text-lg">✨</span>
//               <p className="text-sm font-bold text-pink-600 italic">
//                 Tap the heart to send Ruth some love!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* 3. Media Gallery (Video/Photos) */}
//         <div className="bg-gray-50">
//           <MediaGallery />
//         </div>

//         {/* 4. Guestbook Section */}
//         <div className="px-6 py-8 bg-white">
//           <div className="mb-8 text-center">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Leave a Wish ✍️
//             </h2>
//             <p className="text-gray-500 text-sm">
//               Share a memory or a sweet message for the birthday girl
//             </p>
//           </div>
//           <CommentsList />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="text-center py-12">
//         <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
//           Made with ❤️ for Ruth's 6th Birthday
//         </p>
//         <p className="text-gray-300 text-xs mt-2">© 2026 • Six & Fabulous</p>
//       </footer>
//     </div>
//   );
// }

// 'use client';
// import PostHeader from '@/components/PostHeader';
// import MediaGallery from '@/components/MediaGallery';
// import CommentsList from '@/components/CommentsList';
// import LikeButton from '@/components/LikeButton';
// import Carousel from '@/components/Carousel';
// import LoginButton from '@/components/LoginButton'; // ✅ NEW: Import the login button

// export default function HomePage() {
//   return (
//     <div className="bg-gray-100 min-h-screen py-6 md:py-12 px-4">
//       {/* 🔐 AUTH SECTION: Placed at the top for easy access */}
//       <div className="max-w-2xl mx-auto flex justify-end mb-4">
//         <LoginButton />
//       </div>

//       {/* 🎬 Carousel at the top */}
//       <Carousel />

//       {/* The White "Post" Card */}
//       <main className="max-w-2xl mx-auto bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 mt-4">
//         {/* 1. Header */}
//         <div className="px-4">
//           <PostHeader />
//         </div>

//         {/* 2. Text Content */}
//         <div className="px-6 pb-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
//             🎉 Happy 5th Birthday, Ruth! 🎂
//           </h1>

//           <p className="text-lg text-gray-700 mb-4">
//             🎈 You're Invited! Join us in celebrating 5 wonderful years.
//           </p>

//           <div className="flex flex-col gap-4">
//             <LikeButton />

//             <div className="flex flex-wrap gap-3">
//               <a
//                 href="https://birthday-invitation-sigma.vercel.app"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-bold text-sm"
//               >
//                 🌐 View Live Site
//               </a>

//               <a
//                 href="https://github.com/haroldmaclean/birthday-invitation/edit/main/src/app/page.js"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition font-bold text-sm"
//               >
//                 ✏️ Edit Page
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* 3. Media Gallery */}
//         <MediaGallery />

//         {/* 4. Comments */}
//         <div className="px-6 py-4 border-t border-gray-100">
//           <CommentsList />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="text-center text-gray-400 text-xs mt-8 pb-10">
//         Designed for Ruth's 5th Birthday © 2026
//       </footer>
//     </div>
//   );
// }

// // 'use client';

// // import PostHeader from '@/components/PostHeader';
// // import MediaGallery from '@/components/MediaGallery';
// // import CommentsList from '@/components/CommentsList';
// // import LikeButton from '@/components/LikeButton';
// // import Carousel from '@/components/Carousel'; // ✅ NEW

// // export default function HomePage() {
// //   return (
// //     <div className="bg-gray-100 min-h-screen py-6 md:py-12 px-4">
// //       {/* 🎬 Carousel at the top */}
// //       <Carousel />

// //       {/* The White "Post" Card */}
// //       <main className="max-w-2xl mx-auto bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 mt-4">
// //         {/* 1. Header */}
// //         <div className="px-4">
// //           <PostHeader />
// //         </div>

// //         {/* 2. Text Content */}
// //         <div className="px-6 pb-4">
// //           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
// //             🎉 Happy 5th Birthday, Ruth! 🎂
// //           </h1>

// //           <p className="text-lg text-gray-700 mb-4">
// //             🎈 You're Invited! Join us in celebrating 5 wonderful years.
// //           </p>

// //           <div className="flex flex-col gap-4">
// //             <LikeButton />

// //             <div className="flex flex-wrap gap-3">
// //               <a
// //                 href="https://birthday-invitation-sigma.vercel.app"
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-bold text-sm"
// //               >
// //                 🌐 View Live Site
// //               </a>

// //               <a
// //                 href="https://github.com/haroldmaclean/birthday-invitation/edit/main/src/app/page.js"
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition font-bold text-sm"
// //               >
// //                 ✏️ Edit Page
// //               </a>
// //             </div>
// //           </div>
// //         </div>

// //         {/* 3. Media Gallery */}
// //         <MediaGallery />

// //         {/* 4. Comments */}
// //         <div className="px-6 py-4 border-t border-gray-100">
// //           <CommentsList />
// //         </div>
// //       </main>

// //       {/* Footer */}
// //       <footer className="text-center text-gray-400 text-xs mt-8 pb-10">
// //         Designed for Ruth's 5th Birthday © 2025
// //       </footer>
// //     </div>
// //   );
// // }
