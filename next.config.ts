import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admins (Basic-Auth gated) can paste arbitrary product image URLs in the
    // /admin/products form, so we need to accept any https host as a Next.js
    // <Image> source. The Vercel image proxy still bounds request size and
    // applies its own per-deployment limits, so the security blast radius is
    // small. Inline base64 data: URLs are always allowed natively.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
