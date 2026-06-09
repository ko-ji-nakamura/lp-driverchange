/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: true,
    cpus: 1,
    webpackBuildWorker: false,
  },
};

export default nextConfig;
