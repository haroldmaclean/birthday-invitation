/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disables the react/no-unescaped-entities rule
    ignoreDuringBuilds: true, // Prevents build errors during production
    // Custom ESLint configuration
    rules: {
      'react/no-unescaped-entities': 'off', // Disable the rule globally
    },
  },
};

export default nextConfig;
