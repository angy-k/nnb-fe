const pathsToRewrite = () => {
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
        source: '/carolija-peciva-kafe',
        destination: '/prijatelji/carolija-peciva-kafe',
        permanent: true
      },
      {
        source: '/category/:path',
        destination: '/',
        permanent: true
      },
      //primer rute koju treba srediti nocnibazar.rs/65-novosadski-nocni-bazar
    ];
}

module.exports = pathsToRewrite();
