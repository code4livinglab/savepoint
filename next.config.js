/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/users/sign-in",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/users/sign-up",
        permanent: true,
      },
    ];
  },
  transpilePackages: ["three"],
  experimental: {
    optimizeCss: false, // CSSの最適化を無効化
  },
  webpack: (config, { dev, isServer }) => {
    // キャッシュの設定を調整
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
      name: `${isServer ? "server" : "client"}-${
        dev ? "development" : "production"
      }`,
    };
    return config;
  },
};

module.exports = nextConfig;
