import type { NextConfig } from "next";

// Backend Spring Boot tujuan proxy. Di Vercel isi dengan https://api.myartoku.com
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // Browser memanggil /api/* di origin yang sama lalu diteruskan ke backend,
  // jadi tidak kena CORS (termasuk di preview deployment yang URL-nya berubah-ubah)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
