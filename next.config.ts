import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export (out/) — no server needed. The site is SSG-only
  // (no API routes / server actions), so it deploys as plain files to
  // Cloudflare Pages' CDN (free, unlimited bandwidth, Tashkent PoP).
  output: "export",
  // Static export can't run Next's image optimizer — serve originals and let
  // Cloudflare's CDN cache/compress them at the edge.
  images: { unoptimized: true },
  // Allow loading dev resources (_next/*, HMR) when the site is opened over the
  // LAN IP from a phone — otherwise Next blocks them and the client JS (incl.
  // the 3D canvas) never initialises. Add your Mac's Wi-Fi IP / subnet here.
  allowedDevOrigins: ["192.168.50.199", "192.168.50.*", "*.local"],
  // Hide the floating dev indicator (dev-only anyway) so it doesn't overlap the
  // 3D showcase while testing on a phone.
  devIndicators: false,
};

export default nextConfig;
