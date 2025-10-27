/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // allow Google profile images
      // add any other domains if needed
    ],
  },
};

module.exports = nextConfig;
