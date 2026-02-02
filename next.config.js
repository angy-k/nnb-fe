const path = require('path');
const fs = require('fs');
// const officeConfig = require(`./office-config/config.json`)
const genereateRobotsTxt = require('./src/scripts/generate-robots-txt');
const rewriteOldPaths = require('./rewriteOldPaths');

/** @type {import('next').NextConfig} */

// const { withSentryConfig } = require('@sentry/nextjs')
const readFile = direcotryPath => {
  const fileData = JSON.parse(
    JSON.stringify(fs.readFileSync(direcotryPath).toString()),
  )
  return fileData
}
const officeConfig = readFile(`./${process.env.NEXT_PUBLIC_APP_NAME}-config/config.json`)
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: `.next`, //!!domain ? `.next` : `./build/${process.env.NEXT_PUBLIC_APP_NAME}`,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'scontent.cdninstagram.com' },
      { protocol: 'https', hostname: 'instagram.fbeg6-1.fna.fbcdn.net' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
  env: {
    ...JSON.parse(officeConfig).envs[`${process.env.NEXT_PUBLIC_ENV || process.env.npm_config_env || 'dev'}`],
    ...JSON.parse(officeConfig).agency,
    ...JSON.parse(officeConfig).common,
    default: JSON.parse(officeConfig).agency,
    favicon: JSON.parse(officeConfig).agency.info.favicon,
    headerItems: JSON.parse(officeConfig).agency.headerItems,
    footerItems: JSON.parse(officeConfig).agency.footerItems,
    officeData: JSON.parse(officeConfig).officeData,
  },
  async redirects() {
    return [
      ...rewriteOldPaths
    ]
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: `/${process.env.NEXT_PUBLIC_APP_NAME}/robots.txt`,
      },
    ]
  },
  async headers() {
    const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' || process.env.ALLOW_INDEXING === 'true'

    if (allowIndexing) {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ]
  },
  sassOptions: {
    includePaths: [path.resolve(__dirname, 'sass')],
    prependData: `
      @import "src/styles/_button.sass"
      @import "src/styles/_mixins.sass"
      @import "src/styles/_layout.sass"
      @import "src/styles/_responsive.sass"
      @import "src/styles/_vars.sass"
    `
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (isServer) {
      genereateRobotsTxt()
    }
    config.module.rules.push({
      test: /\.pdf/,
      type: 'asset/resource',
    })
    return config
  },
  // sentry: {
  //   hideSourceMaps: 
  //     process.env.NEXT_PUBLIC_ENV !== 'dev' &&
  //     process.env.NEXT_PUBLIC_ENV !== 'development'
  // },
}

// const sentryWebpackPluginOptions = {
//   silent: true,
// }

// if (
//   process.env.NEXT_PUBLIC_ENV !== 'dev' &&
//   process.env.NEXT_PUBLIC_ENV !== 'development'
// ) {
//   module.exports = withSentryConfig(nextConfig, sentryWebpackOptions)
// } else {
  module.exports = nextConfig
// }
