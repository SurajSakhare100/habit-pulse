import { withSitemap } from 'next-sitemap';

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default withSitemap(nextConfig);
