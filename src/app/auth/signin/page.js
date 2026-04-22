'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border-4 border-pink-200">
        <h1 className="text-2xl font-black text-gray-800 mb-2">Welcome! 🎈</h1>
        <p className="text-gray-600 mb-8 font-medium">
          Sign in with Google to leave a special wish for Ruth.
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-gray-700 font-bold py-3 px-4 rounded-2xl transition-all active:scale-95 shadow-sm"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
