import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Terminal error fix: Apne local IP ko allow karne ke liye
  allowedDevOrigins: ['10.99.33.219', 'localhost:3000'],
};

export default nextConfig;