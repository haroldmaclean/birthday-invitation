import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// 🔍 DEBUG LOGS (run on server start)
console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('SECRET LOADED:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // 👈 shows detailed logs
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: true, // 👈 This will show detailed error logs in your terminal
//   callbacks: {
//     // This allows us to access the user's ID or email easily in the frontend
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
