import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Ruth's 6th Birthday | Five & Fabulous",
  description:
    "Join us in celebrating Ruth's big day! Click to view photos and leave a birthday wish.",
  openGraph: {
    title: "Ruth's 6th Birthday | Sive & Fabulous",
    description:
      "You're invited! Share your favorite memories and birthday wishes for Ruth.",
    url: 'https://birthday-invitation-sigma.vercel.app',
    siteName: "Ruth's Birthday Wall",
    images: [
      {
        url: 'https://birthday-invitation-sigma.vercel.app/og-image.jpg', // Ensure this file is in your /public folder
        width: 1200,
        height: 630,
        alt: "Ruth's 6th Birthday Celebration",
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ruth's 6th Birthday",
    description: 'Leave a wish for Ruth!',
    images: ['https://birthday-invitation-sigma.vercel.app/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

// import { Inter } from 'next/font/google';
// import './globals.css';
// import AuthProvider from '@/components/AuthProvider'; // Import the wrapper

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: "Ruth's 5th Birthday",
//   description: 'Birthday Invitation',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* Wrapping children allows all pages to access the session */}
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   );
// }
