const path = require('path');
const fs = require('fs');
// const officeConfig = require(`./office-config/config.json`)
const genereateRobotsTxt = require('./src/scripts/generate-robots-txt');

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
  distDir: `build/${process.env.NEXT_PUBLIC_APP_NAME}`,
  env: {
    ...JSON.parse(officeConfig).envs[`${process.env.npm_config_env}`],
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
      //old routes redirections ... should be deleted in a few months - first check with SEO team
      {
        source: '/nocni-bazar-dogadjaji',
        destination: '/dogadjaji',
        permanent: true
      },
      {
        source: '/ostali-dogadjaji',
        destination: '/dogadjaji',
        permanent: true
      },
      {
        source: '/partneri/projekat-market-of-entrepreneurship/', // stari projekat
        destination: '/projekti/projekat-market-of-entrepreneurship',
        permanent: true
      },
      {
        source: '/kalendar-manifestacija-u-2024-godini',
        destination: '/kalendar-dogadjaja', //add year as a query param???,
        permanent: true
      },
      {
        source: '/kalendar-manifestacija-u-2023-godini',
        destination: '/kalendar', //add year as a query param???,
        permanent: true
      },
      {
        source: '/kalendar-manifestacija-u-2022-godini',
        destination: '/kalendar', //add year as a query param???,
        permanent: true
      },
      {
        source: '/partneri',
        destination: '/prijatelji',
        permanent: true
      },
      {
        source: '/partneri/:path',
        destination: '/prijatelji/:path',
        permanent: true
      },
      {
        source: '/sponzori',
        destination: '/prijatelji',
        permanent: true
      },
      {
        source: '/erasmus',
        destination: '/prijatelji/erasmus',
        permanent: true
      },
      {
        source: '/fruski-jazacki',
        destination: '/prijatelji/fruski-jazacki',
        permanent: true
      },
      {
        source: '/category/:path',
        destination: '/',
        permanent: true
      }

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
