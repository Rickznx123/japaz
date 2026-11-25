/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel otimiza e guarda em cache: o Supabase só é lido na primeira vez de cada imagem.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

export default nextConfig
