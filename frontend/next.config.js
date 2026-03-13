/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        // Keep RSC payloads in the client-side router cache so navigating back
        // to a previously visited route is instant (no server round-trip).
        staleTimes: {
            dynamic: 30,  // seconds — dynamic (auth-gated) pages
            static: 180,  // seconds — fully static pages
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "haemonymusicai.s3.us-east-1.amazonaws.com",
            },
        ],
    },
};

export default config;
