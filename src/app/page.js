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

      <hr className="my-8" />

      <CommentsList />
    </main>
  );
}
