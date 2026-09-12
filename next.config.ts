import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 取り込み済みのローカル写真のみを扱う
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
