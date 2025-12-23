'use client';

import PostHeader from '@/components/PostHeader';
import MediaGallery from '@/components/MediaGallery';
import CommentsList from '@/components/CommentsList';
import LikeButton from '@/components/LikeButton';

export default function HomePage() {
  return (
    // bg-gray-100 gives that light gray Facebook background
    <div className="bg-gray-100 min-h-screen py-6 md:py-12 px-4">
      {/* The White "Post" Card */}
      <main className="max-w-2xl mx-auto bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        {/* 1. Header (Ruth's Mom) */}
        <div className="px-4">
          <PostHeader />
        </div>

        {/* 2. Text Content & Original Buttons */}
        <div className="px-6 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            🎉 Happy 5th Birthday, Ruth! 🎂
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            🎈 You're Invited! Join us in celebrating 5 wonderful years.
          </p>

          <div className="flex flex-col gap-4">
            <LikeButton />

            <div className="flex flex-wrap gap-3">
              <a
                href="https://birthday-invitation-sigma.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-bold text-sm"
              >
                🌐 View Live Site
              </a>
              <a
                href="https://github.com/haroldmaclean/birthday-invitation/edit/main/src/app/page.js"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition font-bold text-sm"
              >
                ✏️ Edit Page
              </a>
            </div>
          </div>
        </div>

        {/* 3. The Media Gallery (The photos and video you just added!) */}
        <MediaGallery />

        {/* 4. Interaction Divider */}
        <div className="px-6 py-4 border-t border-gray-100">
          <CommentsList />
        </div>
      </main>

      <footer className="text-center text-gray-400 text-xs mt-8 pb-10">
        Designed for Ruth's 5th Birthday © 2025
      </footer>
    </div>
  );
}
