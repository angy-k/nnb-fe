const fs = require('fs');

const readFile = (directoryPath) => {
  const fileData = JSON.parse(JSON.stringify(fs.readFileSync(directoryPath).toString()));
  return fileData;
}

const defaultConfig = {...JSON.parse(readFile(`./office-config/config.json`))};

const crawlableRobotsTxt = (appUrl) => {return `User-Agent: *
Disallow: /api/
Disallow: /*?
Disallow: /prijava
Disallow: /registracija
Disallow: /profil
Disallow: /reset-lozinke

Sitemap: ${appUrl}/sitemap`
}

const uncrawableRobotsTxt = `User-Agent: *\nDisallow: /`

function genereateRobotsTxt() {
  const robotsTxt = process.env.NEXT_PUBLIC_ENV === 'staging' || process.env.NEXT_PUBLIC_ENV === 'prod'
    ? crawlableRobotsTxt(defaultConfig.envs[`${process.env.NEXT_PUBLIC_APP_NAME}`].NEXT_PUBLIC_URL)
    : uncrawableRobotsTxt

    //Create robots.txt file
    fs.writeFileSync(`public/${process.env.NEXT_PUBLIC_APP_NAME}/robots.txt`, robotsTxt)
}

module.exports = genereateRobotsTxt
