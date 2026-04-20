'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3 bg-white/80 p-2 rounded-full shadow-sm">
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full border-2 border-pink-400"
        />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          Hi, {session.user.name.split(' ')[0]}
        </span>
        <button
          onClick={() => signOut()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full shadow-md font-semibold transition border border-gray-200"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-4 h-4"
      />
      Sign in for Ruth's Birthday
    </button>
  );
}
