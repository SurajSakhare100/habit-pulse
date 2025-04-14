/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com', 'paypalobjects.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply headers to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevents clickjacking
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';", // Extra protection
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
