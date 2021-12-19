const { findPagesDir } = require('next/dist/lib/find-pages-dir');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'placeimg.com'],
  },
  webpack(config, { defaultLoaders, dev, dir }) {
    const pagesDir = findPagesDir(dir);
    ((config.module = config.module || {}).rules = config.module.rules || []).push({
      test: /\.(js|mjs|jsx)$/,
      include: [pagesDir],
      use: [
        defaultLoaders.babel,
        {
          loader: 'babel-loader',
          options: {
            sourceMaps: dev,
            plugins: [
              require.resolve('babel-plugin-superjson-next'),
              require.resolve('@babel/plugin-syntax-jsx'),
            ],
          },
        },
      ],
    });
    return config;
  },
};
