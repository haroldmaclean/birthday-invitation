import CommentsList from '@/components/CommentsList';
import LikeButton from '@/components/LikeButton';

export default function HomePage() {
  return (
    <main className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        🎉 Happy 5th Birthday, Ruth! 🎂
      </h1>
      {/* Your banner and image gallery remain here... */}

      <h2 className="text-xl font-semibold mb-2">🎈 You're Invited!</h2>
      <p className="mb-2">Click to like this invitation:</p>
      <LikeButton />

      {/* New Buttons */}
      <div className="mt-6 space-x-4">
        <a
          href="https://birthday-invitation-sigma.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🌐 View Live Site
        </a>
        <a
          href="https://github.com/haroldmaclean/birthday-invitation/edit/main/src/app/page.js"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          title="Only editable if you have GitHub access"
        >
          ✏️ Edit Page
        </a>
      </div>

      <hr className="my-8" />

      <CommentsList />
    </main>
  );
}
