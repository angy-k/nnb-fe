const fs = require('fs');

const readFile = (directoryPath) => {
  const fileData = JSON.parse(JSON.stringify(fs.readFileSync(directoryPath).toString()));
  return fileData;
}

const defaultConfig = {...JSON.parse(readFile(`./office-config/config.json`))};

// Napomena: /paketi se namerno NE navodi ovde.
// Stranica je javno dostupna (link se šalje mejlom), ali ne sme da se indeksira.
// Indeksiranje sprečava `robots: { index: false }` meta tag u src/app/paketi/layout.js.
// Disallow bi bio kontraproduktivan — blokirao bi crawler da uopšte pročita taj meta tag,
// a putanju bi javno izložio svakome ko otvori /robots.txt.
const crawlableRobotsTxt = (appUrl) => {return `User-Agent: *
Disallow: /api/
Disallow: /*?
Disallow: /prijava
Disallow: /registracija
Disallow: /profil
Disallow: /reset-lozinke
Disallow: /moje-rezervacije
Disallow: /prethodne-rezervacije

Sitemap: ${appUrl}/sitemap.xml`
}

const uncrawableRobotsTxt = `User-Agent: *\nDisallow: /`

function genereateRobotsTxt() {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' || process.env.ALLOW_INDEXING === 'true'

  const robotsTxt = allowIndexing
    ? crawlableRobotsTxt(defaultConfig.envs[`${process.env.NEXT_PUBLIC_APP_NAME}`].NEXT_PUBLIC_URL)
    : uncrawableRobotsTxt

    //Create robots.txt file
    fs.writeFileSync(`public/${process.env.NEXT_PUBLIC_APP_NAME}/robots.txt`, robotsTxt)
}

module.exports = genereateRobotsTxt
