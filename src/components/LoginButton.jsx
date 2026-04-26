'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  // 1. Loading State: Matches the soft white/pink container style
  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-white/50 h-10 w-32 rounded-full border border-pink-100 shadow-sm"></div>
    );
  }

  // 2. Logged In: Sleek identity badge as seen in your second screenshot
  if (session) {
    return (
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1 pr-4 rounded-full border border-pink-200 shadow-sm hover:shadow-md transition-all">
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full border-2 border-pink-300 object-cover"
        />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-gray-800 leading-none">
            {session.user.name.split(' ')[0]}
          </span>
          <button
            onClick={() => signOut()}
            className="text-[9px] font-black uppercase tracking-tighter text-rose-500 hover:text-rose-700 text-left"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // 3. Logged Out: High-energy gradient button matching your "Post Wish" style
  return (
    <button
      onClick={() => signIn('google')}
      className="group relative flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.21 5.39-7.84 5.39-4.84 0-8.79-4.01-8.79-8.92s3.95-8.92 8.79-8.92c2.75 0 4.59 1.14 5.64 2.14l2.58-2.49C18.89 1.41 15.93 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c7.2 0 12-5.06 12-12.21 0-.82-.09-1.45-.19-2.14h-11.81z" />
      </svg>
      Sign in to Wish Ruth
    </button>
  );
}

// 'use client';

// import { signIn, signOut, useSession } from 'next-auth/react';

// export default function LoginButton() {
//   const { data: session, status } = useSession();

//   if (status === 'loading') {
//     return (
//       <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
//     );
//   }

//   if (session) {
//     return (
//       <div className="flex items-center gap-3 bg-white/80 p-2 rounded-full shadow-sm">
//         <img
//           src={session.user.image}
//           alt={session.user.name}
//           className="w-8 h-8 rounded-full border-2 border-pink-400"
//         />
//         <span className="text-sm font-medium text-gray-700 hidden sm:inline">
//           Hi, {session.user.name.split(' ')[0]}
//         </span>
//         <button
//           onClick={() => signOut()}
//           className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm transition"
//         >
//           Sign Out
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={() => signIn('google')}
//       className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full shadow-md font-semibold transition border border-gray-200"
//     >
//       <img
//         src="https://www.google.com/favicon.ico"
//         alt="Google"
//         className="w-4 h-4"
//       />
//       Sign in for Ruth's Birthday
//     </button>
//   );
// }
