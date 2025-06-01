/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/api/sso/silent-auth',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' process.env.NEXT_PUBLIC_APP_URL http://localhost:*;"
          }
        ]
      }
    ]
  }
}

export default nextConfig
