/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     // Disables the react/no-unescaped-entities rule during builds
//     ignoreDuringBuilds: true, // Prevents build errors during production
//   },
// };

// export default nextConfig;
