/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // jangan tambahkan `api` di sini
};

// next.config.js
module.exports = {
  output: 'standalone', // penting untuk Docker
};

