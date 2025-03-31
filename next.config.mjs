/** @type {import('next').NextConfig} */
const { withSitemap } = require('next-sitemap');

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = withSitemap(nextConfig);