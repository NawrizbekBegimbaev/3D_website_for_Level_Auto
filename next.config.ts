import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed on Vercel. Every page is still prerendered at build time (SSG) and
  // served from the CDN; the only dynamic thing is POST /api/lead, which needs a
  // server — that's why this is NOT `output: "export"` anymore.
  //
  // Images stay unoptimized (as under the static export) — flip this off to let
  // Vercel's optimizer resize the car photos.
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
