/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=120, stale-while-revalidate=86400',
          },
          {
            key: 'Cache-Tag',
            value: 'blog, ',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
